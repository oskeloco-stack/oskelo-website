'use client';

import { useState } from 'react';
import { Skeleton } from './ui';
import { useRecords, SetupNotice, DueTag } from './organizer';

export default function TasksView() {
  const { items, error, needsSetup, add, update, remove } = useRecords('tasks');
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [showDone, setShowDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const ok = await add({ title, due_on: due });
    if (ok) { setTitle(''); setDue(''); }
  }

  const open = (items || [])
    .filter((t) => !t.done)
    .sort((a, b) => (a.due_on || '9999').localeCompare(b.due_on || '9999'));
  const done = (items || []).filter((t) => t.done);

  async function clearDone() {
    if (!confirm(`Delete all ${done.length} finished to-dos? This can't be undone.`)) return;
    for (const t of done) await remove(t.id);
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>To-dos</h1>
          <p className="admin-lead">A simple running list: edits to deliver, people to call, gear to charge.</p>
        </div>
      </div>

      {needsSetup ? <SetupNotice /> : error && <p className="admin-error">{error}</p>}

      <form className="org-task-add" onSubmit={submit}>
        <input
          className="admin-search"
          placeholder="Add a to-do and press Enter…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="date" className="admin-search org-task-date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date (optional)" />
        <button type="submit" className="admin-primary" disabled={!title.trim()}>Add</button>
      </form>

      {!items ? (
        <Skeleton h={160} />
      ) : (
        <>
          <div className="panel">
            <div className="panel-body org-tasks">
              {open.length === 0 ? (
                <p className="admin-empty">Nothing on the list. Nice.</p>
              ) : (
                open.map((t) => (
                  <div className="org-task" key={t.id}>
                    <input type="checkbox" checked={false} onChange={() => update(t.id, { done: true })} aria-label={`Mark "${t.title}" done`} />
                    <span className="org-task-title">{t.title}</span>
                    {t.due_on && <DueTag day={t.due_on} />}
                    <button className="org-x" onClick={() => remove(t.id)} aria-label="Delete">×</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {done.length > 0 && (
            <div className="org-done-wrap">
              <button type="button" className="admin-mini" onClick={() => setShowDone((s) => !s)}>
                {showDone ? 'Hide' : 'Show'} finished ({done.length})
              </button>
              {showDone && (
                <>
                  <button type="button" className="admin-mini admin-mini-danger" onClick={clearDone}>Clear finished</button>
                  <div className="panel" style={{ marginTop: 10 }}>
                    <div className="panel-body org-tasks">
                      {done.map((t) => (
                        <div className="org-task is-done" key={t.id}>
                          <input type="checkbox" checked onChange={() => update(t.id, { done: false })} aria-label={`Mark "${t.title}" not done`} />
                          <span className="org-task-title">{t.title}</span>
                          <button className="org-x" onClick={() => remove(t.id)} aria-label="Delete">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
