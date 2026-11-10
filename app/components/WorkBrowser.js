'use client';

import { useEffect, useState } from 'react';
import WorkCard from './WorkCard';
import { WORK_FILTERS } from '../../lib/portfolio';

// Filterable portfolio grid. The chosen filter is mirrored in the URL
// (?type=video) so a filtered view can be linked to and survives reloads.
export default function WorkBrowser({ projects }) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type');
    if (WORK_FILTERS.some((f) => f.key === t)) setFilter(t);
  }, []);

  function choose(key) {
    setFilter(key);
    const url = new URL(window.location.href);
    if (key === 'all') url.searchParams.delete('type'); else url.searchParams.set('type', key);
    window.history.replaceState(null, '', url);
  }

  const count = (key) => (key === 'all' ? projects.length : projects.filter((p) => p.filters.includes(key)).length);
  const shown = filter === 'all' ? projects : projects.filter((p) => p.filters.includes(filter));

  return (
    <>
      <div className="s-chips" role="group" aria-label="Filter projects" style={{ marginTop: 0, marginBottom: 40 }}>
        {WORK_FILTERS.map((f) => (
          <button key={f.key} type="button" className="s-chip" aria-pressed={filter === f.key} onClick={() => choose(f.key)}>
            {f.label} <span className="s-count">{count(f.key)}</span>
          </button>
        ))}
      </div>
      <p className="s-sr" aria-live="polite">{shown.length} projects shown</p>
      {shown.length > 0 ? (
        <div className="s-work-grid">
          {shown.map((p) => <WorkCard key={p.id} project={p} aspect={p.kind === 'video' ? '9 / 14' : '4 / 5'} />)}
        </div>
      ) : (
        <p className="s-empty">Nothing in this category yet. New projects are added as they’re finished.</p>
      )}
    </>
  );
}
