'use client';

import { useEffect, useRef, useState } from 'react';

function baseName(name) {
  const dot = name.lastIndexOf('.');
  return dot > -1 ? name.slice(0, dot) : name;
}

function formatBytes(n) {
  if (!n) return '';
  if (n > 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(n / 1024)} KB`;
}

// One row: the original file (previewed locally, never uploaded as-is) and
// the auto-corrected result the server saved to the media library.
function ResultRow({ result, onRename, onDelete }) {
  const [renaming, setRenaming] = useState(false);
  const [value, setValue] = useState(baseName(result.name));
  const [busy, setBusy] = useState(false);

  async function commit() {
    setRenaming(false);
    const typed = value.trim();
    if (!typed || typed === baseName(result.name)) return;
    setBusy(true);
    await onRename(result, typed);
    setBusy(false);
  }

  return (
    <div className="enhance-row">
      <div className="enhance-compare">
        <figure>
          <img src={result.beforeUrl} alt="" />
          <figcaption>Before</figcaption>
        </figure>
        <figure>
          <img src={result.url} alt="" />
          <figcaption>After — auto-corrected</figcaption>
        </figure>
      </div>
      <div className="enhance-meta">
        {renaming ? (
          <input
            className="admin-media-rename"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') setRenaming(false);
            }}
          />
        ) : (
          <button type="button" className="admin-media-name" onClick={() => { setValue(baseName(result.name)); setRenaming(true); }}>
            {result.name}
          </button>
        )}
        <span className="enhance-size">{formatBytes(result.bytes)} · saved to Images</span>
        <div className="admin-media-actions">
          <a className="admin-mini" href="/admin/images" target="_blank" rel="noreferrer">Open Images</a>
          <button type="button" className="admin-mini admin-mini-danger" disabled={busy} onClick={() => onDelete(result)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnhanceView() {
  const [queue, setQueue] = useState([]); // { id, fileName, status, error }
  const [results, setResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef(null);

  // Paste an image straight from the clipboard (a screenshot, or something
  // copied from another app) — one more way in besides drag-drop and the
  // file picker.
  useEffect(() => {
    function onPaste(e) {
      const files = Array.from(e.clipboardData?.items || [])
        .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
        .map((item) => item.getAsFile())
        .filter(Boolean);
      if (files.length > 0) processFiles(files);
    }
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  async function processFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const jobs = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fileName: file.name,
      status: 'working',
      error: '',
    }));
    setQueue((prev) => [...jobs, ...prev]);

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const job = jobs[i];
      const beforeUrl = URL.createObjectURL(file);

      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/admin/enhance', { method: 'POST', body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Could not process that image.');

        setResults((prev) => [{ ...data, beforeUrl, sourceName: file.name }, ...prev]);
        setQueue((prev) => prev.map((q) => (q.id === job.id ? { ...q, status: 'done' } : q)));
      } catch (err) {
        setQueue((prev) => prev.map((q) => (q.id === job.id ? { ...q, status: 'error', error: err.message } : q)));
      }
    }
  }

  async function onRename(result, typed) {
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: result.name, to: typed }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return;
    setResults((prev) =>
      prev.map((r) => (r === result ? { ...r, name: data.name, url: data.url || r.url } : r))
    );
  }

  async function onDelete(result) {
    if (!confirm(`Delete "${result.name}" from the image library?`)) return;
    await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: result.name }),
    });
    setResults((prev) => prev.filter((r) => r !== result));
  }

  const working = queue.some((q) => q.status === 'working');

  return (
    <div className="admin-page admin-page-wide">
      <h1>Enhance</h1>
      <p className="admin-lead">
        Drop in any photo and it's automatically color- and contrast-corrected — auto white
        balance, levels, a light saturation/sharpness boost — then saved as a new image in your
        library. The original file is never changed or uploaded as-is.
      </p>

      <div
        className={`admin-drop admin-drop-lg${dragOver ? ' is-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
        onClick={() => fileInput.current?.click()}
      >
        <input
          ref={fileInput}
          type="file"
          // The MIME wildcard covers anything the OS/browser already calls an
          // image; the extensions are appended so formats with inconsistent
          // MIME reporting (older cameras, some phones) still show up in the
          // picker. What actually happens with each format is decided
          // server-side, not by this list — see /api/admin/enhance.
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.tif,.tiff,.heic,.heif,.bmp"
          multiple
          hidden
          onChange={(e) => processFiles(e.target.files)}
        />
        <p>{working ? 'Correcting…' : 'Drop photos here, or click to choose — or paste with ⌘/Ctrl+V'}</p>
        <span>JPG, PNG, WebP, GIF, AVIF or TIFF · up to 60 MB each</span>
      </div>

      {queue.some((q) => q.status === 'error') && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {queue.filter((q) => q.status === 'error').map((q) => (
            <div key={q.id}>{q.fileName}: {q.error}</div>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <p className="admin-empty">Nothing corrected yet this session.</p>
      ) : (
        <div className="enhance-list">
          {results.map((r) => (
            <ResultRow key={r.name + r.sourceName} result={r} onRename={onRename} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
