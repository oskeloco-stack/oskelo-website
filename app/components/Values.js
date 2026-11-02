'use client';

import { useState } from 'react';

// The six letters of OSKELO. Every value's description is always on the page
// (readable by screen readers, search engines and text-only browsers); the big
// letters are a visual index that highlights the matching description on
// hover, tap or keyboard focus.
export default function Values({ values }) {
  const [active, setActive] = useState(0);

  return (
    <div className="okv">
      <div className="okv-word" aria-hidden="true">
        {values.map((v, i) => (
          <button
            type="button"
            tabIndex={-1}
            key={i}
            className={`okv-letter${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
          >
            <span className="okv-char">{v.letter}</span>
            <span className="okv-name">{v.word}</span>
          </button>
        ))}
      </div>
      <dl className="okv-list">
        {values.map((v, i) => (
          <div
            className={`okv-item${i === active ? ' is-active' : ''}`}
            key={i}
            tabIndex={0}
            onFocus={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
          >
            <dt><span className="okv-item-letter" aria-hidden="true">{v.letter}</span>{v.word}</dt>
            <dd>{v.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
