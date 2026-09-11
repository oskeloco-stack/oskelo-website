'use client';

import { useEffect, useRef, useState } from 'react';
import Lightbox from './Lightbox';

const NEUTRAL = { brightness: 0, contrast: 0, saturation: 0, sharpen: 0, rotate: 0 };

function baseName(name) {
  const dot = name.lastIndexOf('.');
  return dot > -1 ? name.slice(0, dot) : name;
}

function formatBytes(n) {
  if (!n) return '';
  if (n > 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(n / 1024)} KB`;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// A rough-but-instant live preview of the slider values, layered as CSS on
// top of the server-corrected image — no network round-trip while dragging.
// Sharpening has no CSS equivalent, so it only shows up once you hit "Update
// preview" or "Save", which re-run the real sharp pipeline.
function liveStyle(adj) {
  return {
    filter: `brightness(${100 + adj.brightness}%) contrast(${100 + adj.contrast}%) saturate(${100 + adj.saturation}%)`,
    transform: adj.rotate ? `rotate(${adj.rotate}deg)` : undefined,
  };
}

function Slider({ label, value, onChange, min = -100, max = 100 }) {
  return (
    <label className="enhance-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="enhance-slider-value">{value > 0 ? `+${value}` : value}</span>
    </label>
  );
}

function ManualPanel({ item, onAdjust, onRotate, onReset, onRefresh, onSave }) {
  const adj = item.adjustments;
  return (
    <div className="enhance-manual">
      <Slider label="Brightness" value={adj.brightness} onChange={(v) => onAdjust('brightness', v)} />
      <Slider label="Contrast" value={adj.contrast} onChange={(v) => onAdjust('contrast', v)} />
      <Slider label="Saturation" value={adj.saturation} onChange={(v) => onAdjust('saturation', v)} />
      <Slider label="Sharpen" value={adj.sharpen} onChange={(v) => onAdjust('sharpen', v)} min={0} max={100} />
      <div className="enhance-manual-row">
        <button type="button" className="admin-mini" onClick={onRotate}>⟲ Rotate 90°</button>
        <span className="enhance-hint">Sharpen won't show until you update the preview.</span>
      </div>
      <div className="enhance-manual-actions">
        <button type="button" className="admin-mini" onClick={onRefresh} disabled={item.refreshing}>
          {item.refreshing ? 'Updating…' : 'Update preview'}
        </button>
        <button type="button" className="admin-mini" onClick={onReset}>Reset adjustments</button>
        <button type="button" className="admin-primary" onClick={onSave} disabled={item.stage === 'saving'}>
          {item.stage === 'saving' ? 'Saving…' : 'Save to Images'}
        </button>
      </div>
    </div>
  );
}

function EnhanceRow({ item, onSave, onDiscard, onToggleManual, onAdjust, onRotate, onReset, onRefresh, onRename, onDelete, onZoom }) {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [busy, setBusy] = useState(false);

  if (item.stage === 'correcting') {
    return (
      <div className="enhance-row">
        <div className="enhance-compare">
          <figure>
            <img className="is-zoomable" src={item.beforeUrl} alt="" onClick={() => onZoom(item.beforeUrl)} />
            <figcaption>{item.sourceName}</figcaption>
          </figure>
        </div>
        <div className="enhance-meta"><span className="enhance-size">Correcting…</span></div>
      </div>
    );
  }

  if (item.stage === 'error') {
    return (
      <div className="enhance-row">
        <div className="enhance-compare">
          <figure>
            <img className="is-zoomable" src={item.beforeUrl} alt="" onClick={() => onZoom(item.beforeUrl)} />
            <figcaption>{item.sourceName}</figcaption>
          </figure>
        </div>
        <div className="enhance-meta">
          <p className="admin-json-error" style={{ margin: 0 }}>{item.error}</p>
          <div className="admin-media-actions">
            <button type="button" className="admin-mini admin-mini-danger" onClick={() => onDiscard(item)}>Dismiss</button>
          </div>
        </div>
      </div>
    );
  }

  if (item.stage === 'saved') {
    async function commitRename() {
      setRenaming(false);
      const typed = renameValue.trim();
      if (!typed || typed === baseName(item.name)) return;
      setBusy(true);
      await onRename(item, typed);
      setBusy(false);
    }

    return (
      <div className="enhance-row">
        <div className="enhance-compare">
          <figure>
            <img className="is-zoomable" src={item.beforeUrl} alt="" onClick={() => onZoom(item.beforeUrl)} />
            <figcaption>Before</figcaption>
          </figure>
          <figure>
            <img className="is-zoomable" src={item.url} alt="" onClick={() => onZoom(item.url)} />
            <figcaption>Saved</figcaption>
          </figure>
        </div>
        <div className="enhance-meta">
          {renaming ? (
            <input
              className="admin-media-rename"
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setRenaming(false); }}
            />
          ) : (
            <button type="button" className="admin-media-name" onClick={() => { setRenameValue(baseName(item.name)); setRenaming(true); }}>
              {item.name}
            </button>
          )}
          <span className="enhance-size">{formatBytes(item.bytes)} · saved to Images</span>
          <div className="admin-media-actions">
            <a className="admin-mini" href="/admin/images" target="_blank" rel="noreferrer">Open Images</a>
            <button type="button" className="admin-mini admin-mini-danger" disabled={busy} onClick={() => onDelete(item)}>Delete</button>
          </div>
        </div>
      </div>
    );
  }

  // stage === 'reviewing': the auto-corrected result, not saved anywhere yet.
  return (
    <div className="enhance-row">
      <div className="enhance-compare">
        <figure>
          <img className="is-zoomable" src={item.beforeUrl} alt="" onClick={() => onZoom(item.beforeUrl)} />
          <figcaption>Before</figcaption>
        </figure>
        <figure>
          <img
            className="is-zoomable"
            src={item.previewUrl}
            alt=""
            style={liveStyle(item.adjustments)}
            onClick={() => onZoom(item.previewUrl, liveStyle(item.adjustments))}
          />
          <figcaption>{item.manualOpen ? 'Preview (with your adjustments)' : 'After — auto-corrected'}</figcaption>
        </figure>
      </div>
      <div className="enhance-meta">
        <span className="enhance-size">{formatBytes(item.previewBytes)} · not saved yet</span>
        {item.error && <p className="admin-json-error" style={{ margin: 0 }}>{item.error}</p>}
        {item.manualOpen ? (
          <ManualPanel
            item={item}
            onAdjust={(key, v) => onAdjust(item, key, v)}
            onRotate={() => onRotate(item)}
            onReset={() => onReset(item)}
            onRefresh={() => onRefresh(item)}
            onSave={() => onSave(item)}
          />
        ) : (
          <div className="admin-media-actions">
            <button type="button" className="admin-primary" onClick={() => onSave(item)} disabled={item.stage === 'saving'}>
              {item.stage === 'saving' ? 'Saving…' : 'Send to Images'}
            </button>
            <button type="button" className="admin-mini" onClick={() => onToggleManual(item)}>Edit manually</button>
            <button type="button" className="admin-mini admin-mini-danger" onClick={() => onDiscard(item)}>Discard</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnhanceView() {
  const [items, setItems] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [zoomed, setZoomed] = useState(null); // { src, style } | null
  const fileInput = useRef(null);

  function zoom(src, style) {
    setZoomed({ src, style });
  }

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

  function patchItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function processFiles(fileList) {
    const files = Array.from(fileList || []);
    files.forEach((file) => {
      const id = uid();
      const beforeUrl = URL.createObjectURL(file);
      setItems((prev) => [
        { id, file, beforeUrl, sourceName: file.name, stage: 'correcting', adjustments: { ...NEUTRAL }, manualOpen: false, error: '' },
        ...prev,
      ]);
      runCorrection(id, file, NEUTRAL);
    });
  }

  async function runCorrection(id, file, adjustments) {
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('save', '0');
      form.append('auto', '1');
      form.append('brightness', adjustments.brightness);
      form.append('contrast', adjustments.contrast);
      form.append('saturation', adjustments.saturation);
      form.append('sharpen', adjustments.sharpen);
      form.append('rotate', adjustments.rotate);
      const res = await fetch('/api/admin/enhance', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not process that image.');
      patchItem(id, { stage: 'reviewing', previewUrl: data.preview, previewBytes: data.bytes, refreshing: false });
    } catch (err) {
      patchItem(id, { stage: 'error', error: err.message });
    }
  }

  function refreshPreview(item) {
    patchItem(item.id, { refreshing: true });
    runCorrection(item.id, item.file, item.adjustments);
  }

  async function saveToImages(item) {
    patchItem(item.id, { stage: 'saving' });
    try {
      const adj = item.adjustments;
      const form = new FormData();
      form.append('file', item.file);
      form.append('save', '1');
      form.append('auto', '1');
      form.append('brightness', adj.brightness);
      form.append('contrast', adj.contrast);
      form.append('saturation', adj.saturation);
      form.append('sharpen', adj.sharpen);
      form.append('rotate', adj.rotate);
      const res = await fetch('/api/admin/enhance', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save that image.');
      patchItem(item.id, { stage: 'saved', name: data.name, url: data.url, bytes: data.bytes });
    } catch (err) {
      patchItem(item.id, { stage: 'reviewing', error: err.message });
    }
  }

  function discardItem(item) {
    URL.revokeObjectURL(item.beforeUrl);
    setItems((prev) => prev.filter((it) => it.id !== item.id));
  }

  function toggleManual(item) {
    patchItem(item.id, { manualOpen: !item.manualOpen });
  }

  function adjust(item, key, value) {
    patchItem(item.id, { adjustments: { ...item.adjustments, [key]: value } });
  }

  function rotate(item) {
    const next = { ...item.adjustments, rotate: (item.adjustments.rotate + 90) % 360 };
    patchItem(item.id, { adjustments: next });
  }

  function resetAdjustments(item) {
    patchItem(item.id, { adjustments: { ...NEUTRAL } });
  }

  async function onRename(item, typed) {
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: item.name, to: typed }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return;
    patchItem(item.id, { name: data.name, url: data.url || item.url });
  }

  async function onDelete(item) {
    if (!confirm(`Delete "${item.name}" from the image library?`)) return;
    await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: item.name }),
    });
    setItems((prev) => prev.filter((it) => it.id !== item.id));
  }

  const working = items.some((it) => it.stage === 'correcting');

  return (
    <div className="admin-page admin-page-wide">
      <h1>Enhance</h1>
      <p className="admin-lead">
        Drop in any photo and it's automatically color- and contrast-corrected. Nothing is saved
        until you choose to — review the result, fine-tune it by hand if you want, then send it to
        Images or discard it. The original file is never changed.
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

      {items.length === 0 ? (
        <p className="admin-empty">Nothing corrected yet this session.</p>
      ) : (
        <div className="enhance-list">
          {items.map((item) => (
            <EnhanceRow
              key={item.id}
              item={item}
              onSave={saveToImages}
              onDiscard={discardItem}
              onToggleManual={toggleManual}
              onAdjust={adjust}
              onRotate={rotate}
              onReset={resetAdjustments}
              onRefresh={refreshPreview}
              onRename={onRename}
              onDelete={onDelete}
              onZoom={zoom}
            />
          ))}
        </div>
      )}

      {zoomed && (
        <Lightbox src={zoomed.src} style={zoomed.style} onClose={() => setZoomed(null)} />
      )}
    </div>
  );
}
