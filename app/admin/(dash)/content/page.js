'use client';

import { useCallback, useEffect, useState } from 'react';
import StructuredEditor from './StructuredEditor';
import JsonEditor from './JsonEditor';

const SECTIONS = [
  { key: 'work', label: 'Work & galleries' },
  { key: 'services', label: 'Services' },
  { key: 'offers', label: 'Offers' },
];

export default function ContentPage() {
  const [section, setSection] = useState('work');
  const [mode, setMode] = useState('form'); // 'form' | 'json'

  const [value, setValue] = useState(null); // working copy
  const [jsonValid, setJsonValid] = useState(true);
  const [meta, setMeta] = useState({ isDefault: true, updatedAt: null });
  const [status, setStatus] = useState('loading'); // loading | ready | saving | saved | error
  const [message, setMessage] = useState('');

  const load = useCallback((key) => {
    setStatus('loading');
    setMessage('');
    fetch(`/api/admin/content?key=${key}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setStatus('error');
          setMessage(data.error);
          return;
        }
        setValue(data.value);
        setMeta({ isDefault: data.isDefault, updatedAt: data.updatedAt });
        setJsonValid(true);
        setStatus('ready');
      })
      .catch(() => {
        setStatus('error');
        setMessage('Could not load this section.');
      });
  }, []);

  useEffect(() => {
    load(section);
  }, [section, load]);

  async function save() {
    if (mode === 'json' && !jsonValid) return;
    setStatus('saving');
    setMessage('');
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: section, value }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus('error');
      setMessage(data.error || 'Save failed.');
      return;
    }
    setStatus('saved');
    setMeta((m) => ({ ...m, isDefault: false, updatedAt: new Date().toISOString() }));
    setMessage('Saved. Live on the site within about a minute.');
  }

  async function resetToDefault() {
    if (!confirm('Discard your saved edits for this section and go back to the built-in content?')) {
      return;
    }
    setStatus('saving');
    const res = await fetch('/api/admin/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: section }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus('error');
      setMessage(data.error || 'Reset failed.');
      return;
    }
    setValue(data.value);
    setMeta({ isDefault: true, updatedAt: null });
    setStatus('saved');
    setMessage('Reset to the built-in content.');
  }

  const canSave =
    status !== 'saving' &&
    value !== undefined &&
    value !== null &&
    (mode !== 'json' || jsonValid);

  return (
    <div className="admin-page">
      <h1>Content</h1>
      <p className="admin-lead">
        Edit what the public pages show. Changes are stored in Supabase and picked
        up by the site within about a minute — no deploy needed.
      </p>

      <div className="admin-tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={s.key === section ? 'is-active' : undefined}
            onClick={() => setSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="admin-subbar">
        <div className="admin-modeswitch">
          <button
            type="button"
            className={mode === 'form' ? 'is-active' : undefined}
            onClick={() => setMode('form')}
          >
            Form
          </button>
          <button
            type="button"
            className={mode === 'json' ? 'is-active' : undefined}
            onClick={() => setMode('json')}
          >
            Raw JSON
          </button>
        </div>
        <span className="admin-src-tag">
          {meta.isDefault ? 'Showing built-in content' : 'Showing your saved edits'}
        </span>
      </div>

      {status === 'loading' && <p>Loading…</p>}

      {status !== 'loading' && value != null && (
        <>
          {mode === 'form' ? (
            <StructuredEditor value={value} onChange={setValue} />
          ) : (
            <JsonEditor
              value={value}
              onValidChange={(parsed) => {
                if (parsed === undefined) {
                  setJsonValid(false);
                } else {
                  setJsonValid(true);
                  setValue(parsed);
                }
              }}
            />
          )}

          <div className="admin-actions">
            <button
              type="button"
              className="admin-primary"
              onClick={save}
              disabled={!canSave}
            >
              {status === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
            {!meta.isDefault && (
              <button type="button" className="admin-mini admin-mini-danger" onClick={resetToDefault}>
                Reset to built-in default
              </button>
            )}
          </div>
        </>
      )}

      {message && (
        <p className={status === 'error' ? 'admin-json-error' : 'admin-json-ok'}>{message}</p>
      )}
    </div>
  );
}
