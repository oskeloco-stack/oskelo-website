'use client';

import { useRef, useState } from 'react';
import VideoViewer from './VideoViewer';
import { PlayIcon } from './ui';

// One portfolio card. Videos: silent hover preview on real mouse devices
// (never with reduced motion), click opens the viewer. Photo collections:
// a link to their gallery page.
export default function WorkCard({ project, wide = false, showDesc = true, aspect }) {
  const [open, setOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const previewRef = useRef(null);
  const buttonRef = useRef(null);
  const style = aspect ? { aspectRatio: aspect } : undefined;
  const cls = `s-card${wide ? ' s-card--wide' : ''}${previewing ? ' is-previewing' : ''}`;

  if (project.kind === 'photo') {
    const imgStyle = project.focalX != null ? { objectPosition: `${project.focalX}% ${project.focalY}%` } : undefined;
    const inner = (
      <>
        <div className="s-card-media" style={style}>
          <img src={project.image} alt={`${project.name}: ${project.tag}`} loading="lazy" decoding="async" style={imgStyle} />
          <span className="s-card-badge">Photography</span>
        </div>
        <div className="s-card-meta">
          <h3>{project.name}</h3>
          {project.count > 0 && <span>{project.count} photos</span>}
        </div>
        {showDesc && <p className="s-card-desc">{project.tag}</p>}
      </>
    );
    return project.href
      ? <a className={cls} href={project.href}>{inner}</a>
      : <div className={cls}>{inner}</div>;
  }

  function canPreview() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function start() {
    const v = previewRef.current;
    if (!v || open || !canPreview()) return;
    v.muted = true;
    v.play().then(() => setPreviewing(true)).catch(() => {});
  }
  function stop() {
    const v = previewRef.current;
    if (!v) return;
    v.pause();
    setPreviewing(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={cls}
        onClick={() => { stop(); setOpen(true); }}
        onMouseEnter={start}
        onMouseLeave={stop}
        aria-haspopup="dialog"
        aria-label={`Play ${project.name}${project.duration ? `, ${project.duration}` : ''}`}
      >
        <div className="s-card-media" style={style}>
          <img src={project.image} alt="" loading="lazy" decoding="async" />
          <video ref={previewRef} className="s-preview" src={project.video} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
          <span className="s-card-badge"><PlayIcon /> {project.vertical ? 'Short-form' : 'Video'}</span>
          {project.duration && <span className="s-card-dur">{project.duration}</span>}
          <span className="s-card-playbtn" aria-hidden="true"><PlayIcon /></span>
        </div>
        <div className="s-card-meta">
          <h3>{project.name}</h3>
          <span>{project.tag}</span>
        </div>
        {showDesc && project.description && <p className="s-card-desc">{project.description}</p>}
      </button>
      {open && <VideoViewer project={project} onClose={() => setOpen(false)} returnFocusRef={buttonRef} />}
    </>
  );
}
