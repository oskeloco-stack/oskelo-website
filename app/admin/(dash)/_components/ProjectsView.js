'use client';

import { useEffect, useMemo, useState } from 'react';
import { RECORD_TYPES } from '../../../../lib/adminRecords';
import { StatTile, Skeleton } from './ui';
import { useRecords, RecordForm, SetupNotice, DueTag, money, daysFrom } from './organizer';

const FILTERS = [
  ['active', 'Active'],
  ['unpaid', 'Unpaid'],
  ['delivered', 'Delivered'],
  ['all', 'All'],
];

const statusField = RECORD_TYPES.projects.fields.find((f) => f.name === 'status');
const isActive = (p) => p.status === 'booked' || p.status === 'in_progress';
const isUnpaid = (p) => !p.paid && p.status !== 'cancelled';

export default function ProjectsView() {
  const { items, error, needsSetup, add, update, remove } = useRecords('projects');
  const [filter, setFilter] = useState('active');
  const [editing, setEditing] = useState(null);
  const [prefill, setPrefill] = useState(null);

  // "Make a project" from a Messages inquiry lands here as ?client=…&email=…
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('client') || p.get('email')) {
      setPrefill({ client: p.get('client') || '', email: p.get('email') || '', notes: p.get('notes') || '' });
      setEditing('new');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const stats = useMemo(() => {
    const list = items || [];
    const live = list.filter((p) => p.status !== 'cancelled');
    return {
      active: list.filter(isActive).length,
      dueSoon: list.filter((p) => isActive(p) && p.due_on && daysFrom(p.due_on) <= 7).length,
      booked: live.reduce((s, p) => s + Number(p.price || 0), 0),
      paid: live.filter((p) => p.paid).reduce((s, p) => s + Number(p.price || 0), 0),
      unpaid: live.filter(isUnpaid).reduce((s, p) => s + Number(p.price || 0), 0),
      unpaidCount: live.filter(isUnpaid).length,
    };
  }, [items]);

  const shown = (items || []).filter((p) => {
    if (filter === 'active') return isActive(p);
    if (filter === 'unpaid') return isUnpaid(p);
    if (filter === 'delivered') return p.status === 'delivered';
    return true;
  });

  async function del(p) {
    if (!confirm(`Delete the ${p.client} project? This can't be undone.`)) return;
    await remove(p.id);
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Projects</h1>
          <p className="admin-lead">Your booked clients and jobs: what's due, what's delivered, and who still owes you.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-primary" onClick={() => { setPrefill(null); setEditing('new'); }}>+ New project</button>
        </div>
      </div>

      {needsSetup ? <SetupNotice /> : error && <p className="admin-error">{error}</p>}

      <div className="stat-row">
        {!items ? (
          <><Skeleton h={96} /><Skeleton h={96} /><Skeleton h={96} /><Skeleton h={96} /></>
        ) : (
          <>
            <StatTile label="Active projects" value={stats.active} sub={stats.dueSoon ? `${stats.dueSoon} due within 7 days` : 'Nothing due this week'} />
            <StatTile label="Total booked" value={money(stats.booked)} sub="All non-cancelled jobs" />
            <StatTile label="Paid" value={money(stats.paid)} />
            <StatTile label="Still owed" value={money(stats.unpaid)} sub={`${stats.unpaidCount} unpaid project${stats.unpaidCount === 1 ? '' : 's'}`} />
          </>
        )}
      </div>

      {editing && (
        <RecordForm
          key={editing === 'new' ? `new-${prefill?.email || ''}` : editing.id}
          type="projects"
          item={editing === 'new' ? null : editing}
          prefill={editing === 'new' ? prefill : null}
          title={editing === 'new' ? 'New project' : `Edit ${editing.client}`}
          submitLabel={editing === 'new' ? 'Save project' : 'Save changes'}
          onSubmit={(v) => (editing === 'new' ? add(v) : update(editing.id, v))}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="org-toolbar">
        <div className="seg">
          {FILTERS.map(([v, label]) => (
            <button key={v} type="button" className={v === filter ? 'is-active' : undefined} onClick={() => setFilter(v)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {!items ? (
        <Skeleton h={200} />
      ) : shown.length === 0 ? (
        <p className="admin-empty org-empty">
          {items.length === 0 ? 'No projects yet. Add one when a client books you.' : 'Nothing in this view.'}
        </p>
      ) : (
        <div className="org-table-wrap">
          <table className="org-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Price</th>
                <th>Due</th>
                <th>Status</th>
                <th>Paid</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="org-main">{p.client}</div>
                    <div className="org-sub">
                      {p.title && <span>{p.title}</span>}
                      {p.email && <span><a href={`mailto:${p.email}`}>{p.email}</a></span>}
                    </div>
                    {p.notes && <div className="org-notes" title={p.notes}>{p.notes}</div>}
                  </td>
                  <td>{p.service || '—'}</td>
                  <td className="org-nowrap">{p.price != null ? money(p.price) : '—'}</td>
                  <td className="org-nowrap">
                    {isActive(p) ? <DueTag day={p.due_on} /> : <DueTag doneLabel={p.status === 'delivered' ? 'Delivered' : '—'} />}
                  </td>
                  <td>
                    <select
                      className={`org-status s-${p.status}`}
                      value={p.status}
                      onChange={(e) => update(p.id, { status: e.target.value })}
                    >
                      {statusField.options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`org-paid${p.paid ? ' is-paid' : ''}`}
                      onClick={() => update(p.id, { paid: !p.paid })}
                      title="Click to toggle"
                    >
                      {p.paid ? 'Paid' : 'Unpaid'}
                    </button>
                  </td>
                  <td>
                    <div className="org-actions">
                      <button className="admin-mini" onClick={() => setEditing(p)}>Edit</button>
                      <button className="admin-mini admin-mini-danger" onClick={() => del(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
