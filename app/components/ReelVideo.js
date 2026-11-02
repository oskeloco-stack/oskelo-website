'use client';

import { useEffect, useRef, useState } from 'react';

// Poster + title cover until clicked. On devices with a real mouse, hovering
// plays a silent preview (skipped for reduced-motion users); clicking starts
// the full video from the top with sound and controls.
export default function ReelVideo({ src, poster, eyebrow, title }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  // Only one reel plays with sound at a time: starting one pauses the others.
  useEffect(() => {
    function onOtherPlay(e) {
      if (e.detail !== videoRef.current) videoRef.current?.pause();
    }
    window.addEventListener('oskelo:reel-play', onOtherPlay);
    return () => window.removeEventListener('oskelo:reel-play', onOtherPlay);
  }, []);

  // When a video finishes, go back to the cover so the card looks finished too.
  function reset() {
    setStarted(false);
    videoRef.current?.load();
  }

  function canPreview() {
    return typeof window !== 'undefined'
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function startPreview() {
    const v = videoRef.current;
    if (started || !v || !canPreview()) return;
    v.muted = true;
    v.play().then(() => setPreviewing(true)).catch(() => {});
  }

  function stopPreview() {
    const v = videoRef.current;
    if (started || !v) return;
    v.pause();
    setPreviewing(false);
    v.load(); // back to the poster frame
  }

  function play() {
    const v = videoRef.current;
    setStarted(true);
    setPreviewing(false);
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    window.dispatchEvent(new CustomEvent('oskelo:reel-play', { detail: v }));
    v.play().catch(() => {});
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        loop={!started}
        preload="none"
        onEnded={started ? reset : undefined}
        aria-label={title}
      />
      {!started && (
        <button
          type="button"
          className={`reel-cover${previewing ? ' is-previewing' : ''}`}
          onClick={play}
          onMouseEnter={startPreview}
          onMouseLeave={stopPreview}
          aria-label={`Play ${title}`}
        >
          <span className="reel-play">▶</span>
          <span className="reel-cover-text">
            <span className="reel-cover-eyebrow">{eyebrow}</span>
            <span className="reel-cover-title">{title}</span>
          </span>
        </button>
      )}
    </>
  );
}
