import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getAdminUser } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import {
  MEDIA_MAX_BYTES as MAX_BYTES,
  MEDIA_ALLOWED_TYPES as ALLOWED,
  baseNameFrom,
  uploadToMedia,
} from '../../../../lib/mediaUpload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

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
    return NextResponse.json({ error: 'File is larger than 25 MB.' }, { status: 400 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `${file.type} is not an allowed image type.` }, { status: 400 });
  }

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const correctedBuffer = await autoCorrect(inputBuffer);

    const supabase = createAdminClient();
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
