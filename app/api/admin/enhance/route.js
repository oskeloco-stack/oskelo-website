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

// Runs the same pipeline for both the "preview" and "save" calls, so what you
// end up saving always matches what you previewed. With every manual value
// left at 0 this reduces to exactly the original one-click auto-correct:
//   - rotate()      auto-orients using the file's EXIF tag
//   - normalize()   auto white balance / levels (only when auto=true)
//   - modulate()    brightness/saturation — the auto baseline plus whatever
//                    the brightness/saturation sliders add on top
//   - linear()      contrast (a slider has no direct sharp equivalent; this
//                    is the standard "scale around mid-grey" formula)
//   - sharpen()     the auto baseline plus whatever the sharpen slider adds
async function buildCorrectedBuffer(buffer, opts) {
  const { auto, rotateDeg, brightness, contrast, saturation, sharpen } = opts;

  let img = sharp(buffer).rotate(); // EXIF auto-orient
  if (rotateDeg) img = img.rotate(rotateDeg);
  img = img.resize({ width: 2000, withoutEnlargement: true });
  if (auto) img = img.normalize();

  const brightnessFactor = clamp((auto ? 1.02 : 1) + brightness / 100, 0.2, 3);
  const saturationFactor = clamp((auto ? 1.08 : 1) + saturation / 100, 0, 3);
  img = img.modulate({ brightness: brightnessFactor, saturation: saturationFactor });

  if (contrast) {
    const c = clamp(1 + contrast / 100, 0.2, 3);
    img = img.linear(c, 128 * (1 - c));
  }

  const sharpenSigma = (auto ? 0.6 : 0) + (sharpen / 100) * 2;
  if (sharpenSigma > 0) img = img.sharpen({ sigma: sharpenSigma });

  return img.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

// POST — always runs the correction; `save=1` also uploads the result to the
// media library, otherwise it just returns a preview (nothing is written
// anywhere), so trying different manual settings costs nothing until you
// actually choose to keep one.
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

  const opts = {
    auto: form.get('auto') !== '0',
    rotateDeg: ((numOr(form.get('rotate'), 0, -270, 270) % 360) + 360) % 360,
    brightness: numOr(form.get('brightness'), 0, -100, 100),
    contrast: numOr(form.get('contrast'), 0, -100, 100),
    saturation: numOr(form.get('saturation'), 0, -100, 100),
    sharpen: numOr(form.get('sharpen'), 0, 0, 100),
  };
  const wantsSave = form.get('save') === '1';

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let correctedBuffer;
    try {
      correctedBuffer = await buildCorrectedBuffer(inputBuffer, opts);
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
