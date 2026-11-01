'use client';

import { useRef, useState } from 'react';

export default function ReelVideo({ src, poster, eyebrow, title }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    videoRef.current?.play();
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="none"
        aria-label={title}
      />
      {!started && (
        <button type="button" className="reel-cover" onClick={play} aria-label={`Play ${title}`}>
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
