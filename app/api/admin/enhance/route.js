import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdminClient } from '../../../../lib/adminAuth';
import { baseNameFrom, uploadToMedia } from '../../../../lib/mediaUpload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This tool takes a wider range of input than the plain image uploader — raw
// camera exports (TIFF) run well over the site's usual 25 MB image cap.
const MAX_BYTES = 60 * 1024 * 1024;

// Auto color-correct one image and save the result as a new file in the media
// library (the original upload is never modified). The recipe is a gentle,
// generic "fix a flat or off-color photo" pass, not a creative look:
//   - rotate()      auto-orients using the file's EXIF tag
//   - normalize()   stretches each channel's histogram to use the full
//                    range, which corrects both washed-out contrast and most
//                    color casts (a weak white balance fix)
//   - modulate()    a small saturation/brightness lift to counteract the
//                    slight flatness normalize() alone can leave behind
//   - sharpen()     mild output sharpening, since resizing softens detail
async function autoCorrect(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .normalize()
    .modulate({ saturation: 1.08, brightness: 1.02 })
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

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

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let correctedBuffer;
    try {
      correctedBuffer = await autoCorrect(inputBuffer);
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
