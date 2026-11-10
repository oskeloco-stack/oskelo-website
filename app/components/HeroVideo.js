'use client';

import { useEffect, useRef, useState } from 'react';

// Background showreel for the homepage hero. Shows the poster first, and only
// starts playing when the visitor hasn't asked for reduced motion and isn't on
// a data saver. The small/large sources keep phones on the lighter file.
export default function HeroVideo({ poster, src, mobileSrc }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    if (!reduce && !saveData) setPlay(true);
  }, []);

  useEffect(() => {
    if (play) ref.current?.play().catch(() => {});
  }, [play]);

  if (!play) return <img src={poster} alt="" fetchPriority="high" />;

  return (
    <video ref={ref} poster={poster} muted loop playsInline autoPlay preload="metadata" aria-hidden="true">
      {mobileSrc && <source src={mobileSrc} type="video/mp4" media="(max-width: 700px)" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
