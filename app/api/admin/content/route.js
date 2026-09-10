import { NextResponse } from 'next/server';
import { getAdminUser } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { CONTENT_KEYS } from '../../../../lib/siteContent';
import { WORK_CATEGORIES } from '../../../../lib/work';
import { SERVICES } from '../../../../lib/services';
import { OFFERS } from '../../../../lib/offers';

const DEFAULTS = {
  work: WORK_CATEGORIES,
  services: SERVICES,
  offers: OFFERS,
};

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  return null;
}

export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const key = new URL(request.url).searchParams.get('key');
  if (!CONTENT_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Unknown content key.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('value, updated_at')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({
      key,
      value: DEFAULTS[key],
      isDefault: true,
      updatedAt: null,
    });
  }

  return NextResponse.json({
    key,
    value: data.value,
    isDefault: false,
    updatedAt: data.updated_at,
  });
}

export async function PUT(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  const { key, value } = body || {};
  if (!CONTENT_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Unknown content key.' }, { status: 400 });
  }
  if (!Array.isArray(value)) {
    return NextResponse.json(
      { error: 'Content for this section must be a JSON array.' },
      { status: 400 }
    );
  }
  if (value.length > 500) {
    return NextResponse.json({ error: 'That is too many entries.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// "Reset to built-in default" — drop the row so the site falls back to code.
export async function DELETE(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const key = body?.key;
  if (!CONTENT_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Unknown content key.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('site_content').delete().eq('key', key);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, value: DEFAULTS[key] });
}
