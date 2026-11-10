'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Masonry gallery with a full-screen viewer: arrow keys / buttons move
// between photos, Escape closes and returns focus to the thumbnail.
export default function PhotoGallery({ photos, title }) {
  const [index, setIndex] = useState(-1);
  const thumbs = useRef([]);
  const closeRef = useRef(null);
  const open = index >= 0;

  const close = useCallback(() => {
    const i = index;
    setIndex(-1);
    thumbs.current[i]?.focus();
  }, [index]);
  const go = useCallback((d) => setIndex((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, go]);

  const photo = open ? photos[index] : null;

  return (
    <>
      <div className="s-gallery">
        {photos.map((p, i) => (
          <button
            key={p.src ?? i}
            type="button"
            ref={(el) => { thumbs.current[i] = el; }}
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}${p.alt ? `: ${p.alt}` : ''}`}
          >
            <img
              src={p.src}
              alt={p.alt ?? `${title}, photo ${i + 1}`}
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
              style={p.focalX != null ? { objectPosition: `${p.focalX}% ${p.focalY}%` } : undefined}
            />
          </button>
        ))}
      </div>

      {open && createPortal(
        <div className="s-viewer" role="dialog" aria-modal="true" aria-label={`${title} photo viewer`} onClick={close}>
          <button ref={closeRef} type="button" className="s-viewer-close" onClick={close} aria-label="Close viewer">✕</button>
          {photos.length > 1 && (
            <>
              <button type="button" className="s-viewer-nav s-viewer-nav--prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" className="s-viewer-nav s-viewer-nav--next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <figure className="s-viewer-photo" onClick={(e) => e.stopPropagation()}>
            <img src={photo.src} alt={photo.alt ?? `${title}, photo ${index + 1}`} />
            <figcaption>{index + 1} / {photos.length}{photo.alt ? ` · ${photo.alt}` : ''}</figcaption>
          </figure>
        </div>,
        document.body
      )}
    </>
  );
}
