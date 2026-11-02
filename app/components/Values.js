'use client';

import { useState } from 'react';

// The six letters of OSKELO as one word you can explore: pick a letter to read
// what it means. Plain buttons, so it works with keyboard and screen readers.
export default function Values({ values }) {
  const [active, setActive] = useState(0);
  const current = values[active];

  return (
    <div className="okv">
      <div className="okv-word" role="tablist" aria-label="What OSKELO stands for">
        {values.map((v, i) => (
          <button
            type="button"
            role="tab"
            key={i}
            id={`okv-tab-${i}`}
            aria-selected={i === active}
            aria-controls="okv-panel"
            className={`okv-letter${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className="okv-char" aria-hidden="true">{v.letter}</span>
            <span className="okv-name">{v.word}</span>
          </button>
        ))}
      </div>
      <div className="okv-panel" id="okv-panel" role="tabpanel" aria-labelledby={`okv-tab-${active}`} aria-live="polite">
        <span className="okv-panel-word">{current.word}</span>
        <p key={active}>{current.body}</p>
      </div>
    </div>
  );
}
