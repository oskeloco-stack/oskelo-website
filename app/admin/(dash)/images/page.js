'use client';

import { useEffect, useRef, useState } from 'react';

export default function ImagesPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [copiedName, setCopiedName] = useState('');
  const fileInput = useRef(null);

  function refresh() {
    setStatus('loading');
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setStatus('error');
          setMessage(data.error);
        } else {
          setItems(data.items || []);
          setStatus('ready');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Could not load images.');
      });
  }

  useEffect(refresh, []);

  async function upload(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setStatus('uploading');
    setMessage('');

    const form = new FormData();
    files.forEach((f) => form.append('files', f));

    const res = await fetch('/api/admin/media', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));

    if (data.errors?.length) {
      setMessage(
        `${data.uploaded?.length || 0} uploaded. Problems: ${data.errors.join(' ')}`
      );
    } else {
      setMessage(`${data.uploaded?.length || 0} image(s) uploaded.`);
    }
    refresh();
  }

  async function remove(name) {
    if (!confirm(`Delete "${name}"? Pages still using its URL will show a broken image.`)) {
      return;
    }
    const res = await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data.error || 'Delete failed.');
      return;
    }
    setItems((prev) => prev.filter((i) => i.name !== name));
  }

  async function copyUrl(url, name) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedName(name);
      setTimeout(() => setCopiedName(''), 1500);
    } catch {
      setMessage('Copy failed — select the URL text manually.');
    }
  }

  return (
    <div className="admin-page">
      <h1>Images</h1>
      <p className="admin-lead">
        Upload photos here, then use “Copy URL” — or the “Pick” buttons on the
        Content page — to place them on the site.
      </p>

      <div
        className={`admin-drop${dragOver ? ' is-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files);
        }}
        onClick={() => fileInput.current?.click()}
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => upload(e.target.files)}
        />
        <p>{status === 'uploading' ? 'Uploading…' : 'Drop images here, or click to choose'}</p>
        <span>JPG, PNG, WebP, GIF or AVIF · up to 25 MB each</span>
      </div>

      {message && <p className="admin-json-ok">{message}</p>}
      {status === 'error' && <p className="admin-json-error">{message}</p>}

      <div className="admin-media-grid">
        {items.map((item) => (
          <figure className="admin-media" key={item.name}>
            <img src={item.url} alt="" loading="lazy" />
            <figcaption>
              <span className="admin-media-name" title={item.name}>{item.name}</span>
              <div className="admin-media-actions">
                <button type="button" className="admin-mini" onClick={() => copyUrl(item.url, item.name)}>
                  {copiedName === item.name ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  className="admin-mini admin-mini-danger"
                  onClick={() => remove(item.name)}
                >
                  Delete
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {status === 'ready' && items.length === 0 && (
        <p className="admin-empty">No images uploaded yet.</p>
      )}
    </div>
  );
}
