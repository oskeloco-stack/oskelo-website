'use client';

// Shared pieces for the organizer sections (Outreach, Projects, To-dos):
// a data hook over /api/admin/records and a config-driven add/edit form.

import { useCallback, useEffect, useState } from 'react';
import { RECORD_TYPES, localDay } from '../../../../lib/adminRecords';

async function call(method, body) {
  const res = await fetch('/api/admin/records', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(d.error || 'Something went wrong.'), { needsSetup: d.needsSetup });
  return d;
}

export function useRecords(type) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/records?type=${type}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
          setNeedsSetup(Boolean(d.needsSetup));
          setItems([]);
        } else {
          setError('');
          setItems(d.items);
        }
      })
      .catch(() => { setError('Could not load this section.'); setItems([]); });
  }, [type]);

  useEffect(() => { load(); }, [load]);

  const wrap = (fn) => async (...args) => {
    try {
      setError('');
      return await fn(...args);
    } catch (e) {
      setError(e.message);
      if (e.needsSetup) setNeedsSetup(true);
      return null;
    }
  };

  const add = wrap(async (data) => {
    const { item } = await call('POST', { type, data });
    setItems((prev) => [item, ...(prev || [])]);
    return item;
  });

  const update = wrap(async (id, data) => {
    const { item } = await call('PATCH', { type, id, data });
    setItems((prev) => prev.map((x) => (x.id === id ? item : x)));
    return item;
  });

  const remove = wrap(async (id) => {
    await call('DELETE', { type, id });
    setItems((prev) => prev.filter((x) => x.id !== id));
    return true;
  });

  return { items, error, needsSetup, add, update, remove, reload: load };
}

export function SetupNotice() {
  return (
    <div className="admin-note org-setup">
      <h3>One-time setup needed</h3>
      <p>
        This section saves to your Oskelo database, which needs three new tables first. It takes about a minute:
      </p>
      <ol>
        <li>Open <a href="https://supabase.com/dashboard/project/ropdifjuyekfnltpfdyy/sql/new" target="_blank" rel="noreferrer">the Oskelo project's SQL Editor in Supabase ↗</a></li>
        <li>Paste everything from <code>supabase/admin_organizer.sql</code> (in the website code folder)</li>
        <li>Click <strong>Run</strong>, then reload this page.</li>
      </ol>
    </div>
  );
}

function initialValues(type, item, prefill) {
  const out = {};
  for (const f of RECORD_TYPES[type].fields) {
    if (item) out[f.name] = item[f.name] ?? (f.type === 'checkbox' ? false : '');
    else if (prefill?.[f.name] != null) out[f.name] = prefill[f.name];
    else if (f.type === 'checkbox') out[f.name] = false;
    else if (f.defaultToday) out[f.name] = localDay();
    else if (f.defaultInDays) out[f.name] = localDay(f.defaultInDays);
    else if (f.type === 'select' && !f.blank) {
      const o = f.options[0];
      out[f.name] = Array.isArray(o) ? o[0] : o;
    } else out[f.name] = '';
  }
  return out;
}

export function RecordForm({ type, item, prefill, title, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => initialValues(type, item, prefill));
  const [busy, setBusy] = useState(false);
  const set = (name, v) => setValues((p) => ({ ...p, [name]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const ok = await onSubmit(values);
    setBusy(false);
    if (ok) onCancel();
  }

  return (
    <form className="panel org-form" onSubmit={submit}>
      <div className="panel-head">
        <h2 className="panel-title">{title}</h2>
        <button type="button" className="admin-mini" onClick={onCancel}>Cancel</button>
      </div>
      <div className="panel-body org-form-grid">
        {RECORD_TYPES[type].fields.map((f) => {
          const v = values[f.name];
          let input;
          if (f.type === 'textarea') {
            input = <textarea rows={3} value={v} onChange={(e) => set(f.name, e.target.value)} />;
          } else if (f.type === 'select') {
            input = (
              <select value={v} onChange={(e) => set(f.name, e.target.value)}>
                {f.blank && <option value="">{f.blank}</option>}
                {f.options.map((o) => {
                  const [val, label] = Array.isArray(o) ? o : [o, o];
                  return <option key={val} value={val}>{label}</option>;
                })}
              </select>
            );
          } else if (f.type === 'checkbox') {
            return (
              <label key={f.name} className="org-check">
                <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.name, e.target.checked)} />
                {f.label}
              </label>
            );
          } else {
            input = (
              <input
                type={f.type}
                value={v}
                placeholder={f.placeholder}
                step={f.type === 'number' ? '0.01' : undefined}
                min={f.type === 'number' ? '0' : undefined}
                required={RECORD_TYPES[type].required.includes(f.name)}
                onChange={(e) => set(f.name, e.target.value)}
              />
            );
          }
          return (
            <label key={f.name} className={f.wide ? 'is-wide' : undefined}>
              <span>{f.label}</span>
              {input}
            </label>
          );
        })}
        <div className="is-wide org-form-actions">
          <button type="submit" className="admin-primary" disabled={busy}>
            {busy ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export function shortDate(day) {
  if (!day) return '—';
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const sameYear = y === new Date().getFullYear();
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) });
}

// Whole days from today to `day` (negative = in the past).
export function daysFrom(day) {
  if (!day) return null;
  const [y, m, d] = day.split('-').map(Number);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d) - t) / 86400000);
}

export function DueTag({ day, doneLabel }) {
  if (doneLabel) return <span className="org-due">{doneLabel}</span>;
  const n = daysFrom(day);
  if (n == null) return <span className="org-due is-none">—</span>;
  const cls = n < 0 ? 'is-late' : n === 0 ? 'is-today' : n <= 3 ? 'is-soon' : '';
  const label = n < 0 ? `${shortDate(day)} · ${-n}d late` : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : shortDate(day);
  return <span className={`org-due ${cls}`}>{label}</span>;
}

export function money(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
