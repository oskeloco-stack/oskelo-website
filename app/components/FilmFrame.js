'use client';

import { useRef, useState } from 'react';
import VideoViewer from './VideoViewer';
import { PlayIcon } from './ui';

// Homepage "film strip" tile. A video opens the viewer; a photo collection
// links to its gallery.
export default function FilmFrame({ project, index }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const n = String(index + 1).padStart(2, '0');
  const inner = (
    <>
      <div className="s-frame-img">
        <img src={project.image} alt={project.kind === 'video' ? '' : `${project.name}: ${project.tag}`} loading="lazy" decoding="async" />
      </div>
      <span className="s-frame-play">{project.kind === 'video' ? <><PlayIcon /> Watch · {project.duration || 'Video'}</> : `Photography · ${project.count} photos`}</span>
      <div className="s-frame-bar">
        <b>{project.name}</b>
        <span>{n}</span>
      </div>
    </>
  );

  if (project.kind === 'video') {
    return (
      <>
        <button ref={btnRef} type="button" className="s-frame" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Play ${project.name}`}>
          {inner}
        </button>
        {open && <VideoViewer project={project} onClose={() => setOpen(false)} returnFocusRef={btnRef} />}
      </>
    );
  }
  return <a className="s-frame" href={project.href || '/work?type=photography'}>{inner}</a>;
}
