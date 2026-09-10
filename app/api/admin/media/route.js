import { NextResponse } from 'next/server';
import { getAdminUser } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';

const BUCKET = 'media';
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB per file
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

function slugifyName(filename) {
  const dot = filename.lastIndexOf('.');
  const ext = dot > -1 ? filename.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : 'jpg';
  const base = (dot > -1 ? filename.slice(0, dot) : filename)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'image';
  const hash = Math.random().toString(36).slice(2, 8);
  return `${base}-${hash}.${ext}`;
}

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data || [])
    .filter((row) => row.id && row.name && !row.name.startsWith('.'))
    .map((row) => ({
      name: row.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(row.name).data.publicUrl,
      size: row.metadata?.size ?? null,
      createdAt: row.created_at ?? null,
    }));

  return NextResponse.json({ items });
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 });
  }

  const files = form.getAll('files').filter((f) => typeof f === 'object' && f.size >= 0);
  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const uploaded = [];
  const errors = [];

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      errors.push(`${file.name}: larger than 25 MB.`);
      continue;
    }
    if (file.type && !ALLOWED.includes(file.type)) {
      errors.push(`${file.name}: ${file.type} is not an allowed image type.`);
      continue;
    }

    const key = slugifyName(file.name || 'image.jpg');
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from(BUCKET).upload(key, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

    if (error) {
      errors.push(`${file.name}: ${error.message}`);
      continue;
    }

    uploaded.push({
      name: key,
      url: supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl,
    });
  }

  const status = uploaded.length > 0 ? 200 : 400;
  return NextResponse.json({ uploaded, errors }, { status });
}

export async function DELETE(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const name = body?.name;
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Missing file name.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
