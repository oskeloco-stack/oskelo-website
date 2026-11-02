'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// A reel card: poster + title cover. On devices with a real mouse, hovering
// plays a silent preview in the card (skipped for reduced-motion users).
// Clicking opens a large viewer with sound and controls; Escape, the close
// button or clicking outside the video closes it and returns focus.
export default function ReelVideo({ src, poster, eyebrow, title, duration, description }) {
  const previewRef = useRef(null);
  const coverRef = useRef(null);
  const closeRef = useRef(null);
  const [previewing, setPreviewing] = useState(false);
  const [open, setOpen] = useState(false);

  function canPreview() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function startPreview() {
    const v = previewRef.current;
    if (open || !v || !canPreview()) return;
    v.muted = true;
    v.play().then(() => setPreviewing(true)).catch(() => {});
  }

  function stopPreview() {
    const v = previewRef.current;
    if (!v) return;
    v.pause();
    setPreviewing(false);
    v.load(); // back to the poster frame
  }

  function openViewer() {
    stopPreview();
    setOpen(true);
  }

  function closeViewer() {
    setOpen(false);
    coverRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) { if (e.key === 'Escape') closeViewer(); }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <video ref={previewRef} src={src} poster={poster} playsInline muted loop preload="none" aria-hidden="true" tabIndex={-1} />
      <button
        ref={coverRef}
        type="button"
        className={`reel-cover${previewing ? ' is-previewing' : ''}`}
        onClick={openViewer}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        aria-label={`Play ${title}${duration ? ` (${duration})` : ''}`}
        aria-haspopup="dialog"
      >
        <span className="reel-play">▶</span>
        {duration && <span className="reel-duration">{duration}</span>}
        <span className="reel-cover-text">
          <span className="reel-cover-eyebrow">{eyebrow}</span>
          <span className="reel-cover-title">{title}</span>
        </span>
      </button>

      {open && createPortal(
        <div className="reel-viewer" role="dialog" aria-modal="true" aria-label={title} onClick={closeViewer}>
          <div className="reel-viewer-inner" onClick={(e) => e.stopPropagation()}>
            <button ref={closeRef} type="button" className="reel-viewer-close" onClick={closeViewer} aria-label="Close video">✕</button>
            <video className="reel-viewer-video" src={src} poster={poster} controls autoPlay playsInline />
            <div className="reel-viewer-meta">
              <span className="reel-cover-eyebrow">{eyebrow}</span>
              <h3>{title}</h3>
              {description && <p>{description}</p>}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
