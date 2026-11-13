import { NextResponse } from 'next/server';
import { requireAdminClient } from '../../../../lib/adminAuth';
import { RECORD_TYPES } from '../../../../lib/adminRecords';

export const dynamic = 'force-dynamic';

// One CRUD endpoint for the admin organizer: Outreach, Projects, To-dos.
//   GET    /api/admin/records?type=outreach
//   POST   { type, data }
//   PATCH  { type, id, data }
//   DELETE { type, id }
// Only fields listed in lib/adminRecords.js are ever written.

const SETUP_MESSAGE =
  'This section needs a one-time database setup: open the Oskelo project in Supabase → SQL Editor → ' +
  'paste the contents of supabase/admin_organizer.sql from the website code → Run. Then reload this page.';

function missingTable(error) {
  return (
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    /does not exist|could not find the table/i.test(error?.message || '')
  );
}

function fail(error) {
  if (missingTable(error)) {
    return NextResponse.json({ error: SETUP_MESSAGE, needsSetup: true }, { status: 503 });
  }
  return NextResponse.json({ error: error.message }, { status: 500 });
}

function getType(type) {
  return RECORD_TYPES[type] || null;
}

function clean(cfg, data, { partial }) {
  const out = {};
  for (const f of cfg.fields) {
    if (!(f.name in (data || {}))) continue;
    let v = data[f.name];
    if (f.type === 'checkbox') v = Boolean(v);
    else if (f.type === 'number') v = v === '' || v == null ? null : Number(v);
    else if (typeof v === 'string') v = v.trim() === '' ? null : v.trim().slice(0, 5000);
    else if (v != null) v = null;
    if (f.type === 'number' && v != null && !Number.isFinite(v)) v = null;
    if (f.type === 'date' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) v = null;
    if (f.type === 'select' && v && Array.isArray(f.options[0])) {
      if (!f.options.some((o) => o[0] === v)) continue;
    }
    if (v === null && f.name === 'status') continue; // keep DB default
    out[f.name] = v;
  }
  for (const r of cfg.required) {
    if ((!partial || r in out) && !out[r]) return { error: `${r.replace('_', ' ')} is required.` };
  }
  if (cfg.table === 'tasks' && 'done' in out) out.done_at = out.done ? new Date().toISOString() : null;
  return { data: out };
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET(request) {
  const { client: supabase, error: authError } = await requireAdminClient();
  if (authError) return authError;

  const cfg = getType(new URL(request.url).searchParams.get('type'));
  if (!cfg) return NextResponse.json({ error: 'Unknown type.' }, { status: 400 });

  let query = supabase.from(cfg.table).select('*').limit(1000);
  for (const [col, asc] of cfg.order) query = query.order(col, { ascending: asc });

  const { data, error } = await query;
  if (error) return fail(error);
  return NextResponse.json({ items: data || [] });
}

export async function POST(request) {
  const { client: supabase, error: authError } = await requireAdminClient();
  if (authError) return authError;

  const body = await readBody(request);
  const cfg = getType(body?.type);
  if (!cfg) return NextResponse.json({ error: 'Unknown type.' }, { status: 400 });

  const { data: row, error: vErr } = clean(cfg, body.data, { partial: false });
  if (vErr) return NextResponse.json({ error: vErr }, { status: 400 });

  const { data, error } = await supabase.from(cfg.table).insert(row).select('*').single();
  if (error) return fail(error);
  return NextResponse.json({ item: data });
}

export async function PATCH(request) {
  const { client: supabase, error: authError } = await requireAdminClient();
  if (authError) return authError;

  const body = await readBody(request);
  const cfg = getType(body?.type);
  if (!cfg) return NextResponse.json({ error: 'Unknown type.' }, { status: 400 });
  if (!body.id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const { data: patch, error: vErr } = clean(cfg, body.data, { partial: true });
  if (vErr) return NextResponse.json({ error: vErr }, { status: 400 });
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from(cfg.table)
    .update(patch)
    .eq('id', body.id)
    .select('*')
    .single();
  if (error) return fail(error);
  return NextResponse.json({ item: data });
}

export async function DELETE(request) {
  const { client: supabase, error: authError } = await requireAdminClient();
  if (authError) return authError;

  const body = await readBody(request);
  const cfg = getType(body?.type);
  if (!cfg) return NextResponse.json({ error: 'Unknown type.' }, { status: 400 });
  if (!body.id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const { error } = await supabase.from(cfg.table).delete().eq('id', body.id);
  if (error) return fail(error);
  return NextResponse.json({ ok: true });
}
