import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdminClient } from '../../../../lib/adminAuth';
import { baseNameFrom, uploadToMedia } from '../../../../lib/mediaUpload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This tool takes a wider range of input than the plain image uploader — raw
// camera exports (TIFF) run well over the site's usual 25 MB image cap.
const MAX_BYTES = 60 * 1024 * 1024;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function numOr(value, fallback, min, max) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? clamp(n, min, max) : fallback;
}

function readAdjustments(form, prefix) {
  return {
    brightness: numOr(form.get(`${prefix}Brightness`), 0, -100, 100),
    contrast: numOr(form.get(`${prefix}Contrast`), 0, -100, 100),
    saturation: numOr(form.get(`${prefix}Saturation`), 0, -100, 100),
    sharpen: numOr(form.get(`${prefix}Sharpen`), 0, 0, 100),
    blur: numOr(form.get(`${prefix}Blur`), 0, 0, 25),
  };
}

// Orientation + resize + auto white balance only — the geometry every
// downstream variant (whole-image, foreground, background) has to share
// pixel-for-pixel so a painted mask lines up with all of them.
async function buildBaseImage(buffer, { auto, rotateDeg }) {
  let img = sharp(buffer).rotate(); // EXIF auto-orient
  if (rotateDeg) img = img.rotate(rotateDeg);
  img = img.resize({ width: 2000, withoutEnlargement: true });
  if (auto) img = img.normalize();

  const png = await img.png().toBuffer();
  const meta = await sharp(png).metadata();
  return { buffer: png, width: meta.width, height: meta.height };
}

// Brightness/contrast/saturation/sharpen/blur on top of an already-based
// image. `auto` folds in the same gentle baseline lift the one-click
// auto-correct uses, so "everything at 0" reproduces it exactly.
function applyColorAdjustments(sharpInstance, { brightness, contrast, saturation, sharpen, blur }, auto) {
  const brightnessFactor = clamp((auto ? 1.02 : 1) + brightness / 100, 0.2, 3);
  const saturationFactor = clamp((auto ? 1.08 : 1) + saturation / 100, 0, 3);
  let img = sharpInstance.modulate({ brightness: brightnessFactor, saturation: saturationFactor });

  if (contrast) {
    const c = clamp(1 + contrast / 100, 0.2, 3);
    img = img.linear(c, 128 * (1 - c));
  }

  const sharpenSigma = (auto ? 0.6 : 0) + (sharpen / 100) * 2;
  if (sharpenSigma > 0) img = img.sharpen({ sigma: sharpenSigma });

  if (blur > 0) img = img.blur(Math.max(0.3, blur));

  return img;
}

// The no-mask path: one image, one set of adjustments.
async function buildCorrectedBuffer(buffer, opts) {
  const { auto, rotateDeg, ...adjustments } = opts;
  const { buffer: base } = await buildBaseImage(buffer, { auto, rotateDeg });
  return applyColorAdjustments(sharp(base), adjustments, auto).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

// The masked path: build the shared base once, derive a foreground and a
// background variant with their own adjustments, then blend them per-pixel
// using the mask's alpha channel as the blend weight (alpha 255 = fully
// foreground, 0 = fully background, anything between is a soft edge — a
// brush painted with partial opacity, or resampling from the resize below,
// naturally produces that instead of a jagged cutout).
async function buildMaskedBuffer(buffer, { auto, rotateDeg, fg, bg, maskBuffer }) {
  const { buffer: base, width, height } = await buildBaseImage(buffer, { auto, rotateDeg });

  const [fgRaw, bgRaw, maskRaw] = await Promise.all([
    applyColorAdjustments(sharp(base), fg, auto).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    applyColorAdjustments(sharp(base), bg, auto).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(maskBuffer)
      .resize(width, height, { fit: 'fill' })
      .ensureAlpha()
      .blur(2) // soften the brush's hard edge a little
      .raw()
      .toBuffer({ resolveWithObject: true }),
  ]);

  const channels = fgRaw.info.channels; // 3 (RGB)
  const maskChannels = maskRaw.info.channels; // 4 (RGBA) after ensureAlpha()
  const pixelCount = width * height;
  const out = Buffer.alloc(fgRaw.data.length);

  for (let p = 0; p < pixelCount; p += 1) {
    const alpha = maskRaw.data[p * maskChannels + (maskChannels - 1)] / 255; // painted strength
    const base3 = p * channels;
    for (let c = 0; c < channels; c += 1) {
      const i = base3 + c;
      out[i] = Math.round(fgRaw.data[i] * alpha + bgRaw.data[i] * (1 - alpha));
    }
  }

  return sharp(out, { raw: { width, height, channels } })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

// POST — always runs the correction; `save=1` also uploads the result to the
// media library, otherwise it just returns a preview (nothing is written
// anywhere), so trying different settings costs nothing until you actually
// choose to keep one. A `mask` file switches to the split foreground/
// background pipeline; without one it's the plain single-adjustment path.
export async function POST(request) {
  // Check auth AND that the service-role key is actually configured before
  // doing any file work, so a misconfigured deployment fails fast with a
  // clear message instead of after running the correction.
  const { client: supabase, error: authError } = await requireAdminClient();
  if (authError) return authError;

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!file || typeof file !== 'object') {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is larger than 60 MB.' }, { status: 400 });
  }
  // Deliberately permissive: don't pre-reject on an enumerated MIME list (browsers
  // are inconsistent about what they report, especially for less common formats).
  // Only rule out things that are obviously not photos; let sharp's own decode be
  // the real gate, and translate its failure into a plain-English message below.
  if (file.type && !file.type.startsWith('image/')) {
    return NextResponse.json({ error: `${file.type} isn't an image file.` }, { status: 400 });
  }

  const auto = form.get('auto') !== '0';
  const rotateDeg = ((numOr(form.get('rotate'), 0, -270, 270) % 360) + 360) % 360;
  const maskFile = form.get('mask');
  const hasMask = maskFile && typeof maskFile === 'object' && maskFile.size > 0;

  const wantsSave = form.get('save') === '1';

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let correctedBuffer;
    try {
      if (hasMask) {
        const maskBuffer = Buffer.from(await maskFile.arrayBuffer());
        correctedBuffer = await buildMaskedBuffer(inputBuffer, {
          auto,
          rotateDeg,
          fg: readAdjustments(form, 'fg'),
          bg: readAdjustments(form, 'bg'),
          maskBuffer,
        });
      } else {
        correctedBuffer = await buildCorrectedBuffer(inputBuffer, {
          auto,
          rotateDeg,
          brightness: numOr(form.get('brightness'), 0, -100, 100),
          contrast: numOr(form.get('contrast'), 0, -100, 100),
          saturation: numOr(form.get('saturation'), 0, -100, 100),
          sharpen: numOr(form.get('sharpen'), 0, 0, 100),
          blur: 0,
        });
      }
    } catch {
      // sharp's own errors ("Input buffer has corrupt header", "unsupported
      // image format", ...) aren't meaningful to a non-technical user — the
      // practical cause is almost always an unsupported codec.
      return NextResponse.json(
        {
          error:
            "Couldn't read that as an image. HEIC (iPhone \"Photos\" default) and camera RAW files " +
            "(CR2/NEF/ARW/DNG) aren't supported — export or \"Save As\" a JPG, PNG, WebP, TIFF or AVIF first.",
        },
        { status: 400 }
      );
    }

    if (!wantsSave) {
      return NextResponse.json({
        preview: `data:image/jpeg;base64,${correctedBuffer.toString('base64')}`,
        bytes: correctedBuffer.length,
      });
    }

    const base = `${baseNameFrom(file.name || 'photo.jpg')}-enhanced`;
    const { name, url } = await uploadToMedia(supabase, correctedBuffer, base, 'jpg', 'image/jpeg');

    return NextResponse.json({
      name,
      url,
      bytes: correctedBuffer.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not process that image.' }, { status: 500 });
  }
}
