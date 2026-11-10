'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Arrow } from './ui';

// Full-screen dialog for one video: real controls with sound, project notes,
// and a link to start a similar project. Escape, the close button or a click
// on the backdrop closes it; focus returns to whatever opened it.
export default function VideoViewer({ project, onClose, returnFocusRef }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) { if (e.key === 'Escape') onCloseRef.current(); }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      (returnFocusRef?.current || opener)?.focus?.();
    };
  }, []);

  return createPortal(
    <div className="s-viewer" role="dialog" aria-modal="true" aria-labelledby="s-viewer-title" onClick={onClose}>
      <button ref={closeRef} type="button" className="s-viewer-close" onClick={onClose} aria-label="Close video">✕</button>
      <div className="s-viewer-inner" onClick={(e) => e.stopPropagation()}>
        <video src={project.video} poster={project.image} controls autoPlay playsInline preload="auto" />
        <div className="s-viewer-meta">
          <p className="s-eyebrow">{project.tag}</p>
          <h2 id="s-viewer-title">{project.name}</h2>
          {project.description && <p>{project.description}</p>}
          <dl>
            {project.duration && (<><dt>Length</dt><dd>{project.duration}</dd></>)}
            <dt>Service</dt><dd>{project.service}</dd>
            <dt>Format</dt><dd>{project.vertical ? 'Vertical 9:16, for Reels, TikTok & Shorts' : 'Widescreen'}</dd>
          </dl>
          <a className="s-btn s-btn--light s-btn--sm" href="/contact?interest=One-time%20video#contact">Start a video like this <Arrow /></a>
        </div>
      </div>
    </div>,
    document.body
  );
}
