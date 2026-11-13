'use client';

import { useMemo, useState } from 'react';
import { RECORD_TYPES, localDay } from '../../../../lib/adminRecords';
import { StatTile, Skeleton } from './ui';
import { useRecords, RecordForm, SetupNotice, DueTag, shortDate, daysFrom } from './organizer';

const OPEN = ['emailed', 'followed_up'];
const ACTIVE = ['replied', 'meeting'];
const CLOSED = ['won', 'not_interested', 'no_reply'];

const FILTERS = [
  ['followup', 'Follow up'],
  ['waiting', 'Waiting'],
  ['talking', 'Talking'],
  ['closed', 'Closed'],
  ['all', 'All'],
];

const statusField = RECORD_TYPES.outreach.fields.find((f) => f.name === 'status');

function needsFollowUp(r) {
  return OPEN.includes(r.status) && r.follow_up_on && daysFrom(r.follow_up_on) <= 0;
}

export default function OutreachView() {
  const { items, error, needsSetup, add, update, remove } = useRecords('outreach');
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | row

  const stats = useMemo(() => {
    const list = items || [];
    const weekAgo = localDay(-7);
    return {
      total: list.length,
      week: list.filter((r) => r.contacted_on >= weekAgo).length,
      due: list.filter(needsFollowUp).length,
      replied: list.filter((r) => ACTIVE.includes(r.status) || r.status === 'won').length,
      won: list.filter((r) => r.status === 'won').length,
    };
  }, [items]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (items || [])
      .filter((r) => {
        if (filter === 'followup') return needsFollowUp(r);
        if (filter === 'waiting') return OPEN.includes(r.status);
        if (filter === 'talking') return ACTIVE.includes(r.status);
        if (filter === 'closed') return CLOSED.includes(r.status);
        return true;
      })
      .filter((r) =>
        !term ||
        [r.company, r.contact_name, r.email, r.notes, r.service].some((v) => v?.toLowerCase().includes(term))
      );
  }, [items, filter, q]);

  async function followedUp(r) {
    const stamp = `Followed up ${shortDate(localDay())}.`;
    await update(r.id, {
      status: 'followed_up',
      follow_up_on: localDay(7),
      notes: r.notes ? `${r.notes}\n${stamp}` : stamp,
    });
  }

  async function del(r) {
    if (!confirm(`Delete ${r.company} from your outreach list? This can't be undone.`)) return;
    await remove(r.id);
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Outreach</h1>
          <p className="admin-lead">Every company you've emailed, when you emailed them, and when to follow up.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-primary" onClick={() => setEditing('new')}>+ Log an email</button>
        </div>
      </div>

      {needsSetup ? <SetupNotice /> : error && <p className="admin-error">{error}</p>}

      <div className="stat-row">
        {!items ? (
          <><Skeleton h={96} /><Skeleton h={96} /><Skeleton h={96} /><Skeleton h={96} /></>
        ) : (
          <>
            <StatTile label="Companies emailed" value={stats.total} sub={`${stats.week} in the last 7 days`} />
            <StatTile label="Follow-ups due" value={stats.due} sub={stats.due ? 'Today or overdue' : 'All caught up'} />
            <StatTile label="Got a reply" value={stats.replied} sub={stats.total ? `${Math.round((stats.replied / stats.total) * 100)}% reply rate` : undefined} />
            <StatTile label="Became clients" value={stats.won} />
          </>
        )}
      </div>

      {editing && (
        <RecordForm
          key={editing === 'new' ? 'new' : editing.id}
          type="outreach"
          item={editing === 'new' ? null : editing}
          title={editing === 'new' ? 'Log an email' : `Edit ${editing.company}`}
          submitLabel={editing === 'new' ? 'Save' : 'Save changes'}
          onSubmit={(v) => (editing === 'new' ? add(v) : update(editing.id, v))}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="org-toolbar">
        <div className="seg">
          {FILTERS.map(([v, label]) => (
            <button key={v} type="button" className={v === filter ? 'is-active' : undefined} onClick={() => setFilter(v)}>
              {label}{v === 'followup' && stats.due ? ` (${stats.due})` : ''}
            </button>
          ))}
        </div>
        <input className="admin-search" placeholder="Search companies, notes…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {!items ? (
        <Skeleton h={200} />
      ) : shown.length === 0 ? (
        <p className="admin-empty org-empty">
          {items.length === 0 ? 'No emails logged yet. Click “Log an email” after you reach out to a company.' : 'Nothing matches this filter.'}
        </p>
      ) : (
        <div className="org-table-wrap">
          <table className="org-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Pitched</th>
                <th>Emailed</th>
                <th>Follow up</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="org-main">{r.company}</div>
                    <div className="org-sub">
                      {[r.contact_name, r.email && <a key="e" href={`mailto:${r.email}`}>{r.email}</a>, r.phone]
                        .filter(Boolean)
                        .map((x, i) => <span key={i}>{x}</span>)}
                    </div>
                    {r.notes && <div className="org-notes" title={r.notes}>{r.notes}</div>}
                  </td>
                  <td>{r.service || '—'}</td>
                  <td className="org-nowrap">{shortDate(r.contacted_on)}</td>
                  <td className="org-nowrap">
                    {OPEN.includes(r.status) ? <DueTag day={r.follow_up_on} /> : <span className="org-due is-none">—</span>}
                  </td>
                  <td>
                    <select
                      className={`org-status s-${r.status}`}
                      value={r.status}
                      onChange={(e) => update(r.id, { status: e.target.value })}
                    >
                      {statusField.options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="org-actions">
                      {OPEN.includes(r.status) && (
                        <button className="admin-mini" onClick={() => followedUp(r)} title="Logs today's follow-up and sets the next one a week out">
                          Followed up
                        </button>
                      )}
                      <button className="admin-mini" onClick={() => setEditing(r)}>Edit</button>
                      <button className="admin-mini admin-mini-danger" onClick={() => del(r)}>Delete</button>
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
