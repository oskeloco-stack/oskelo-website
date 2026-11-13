'use client';

import { useEffect, useState } from 'react';
import { StatTile, Panel, BarList, Skeleton, fmt } from './ui';
import TrafficChart from './TrafficChart';
import { DueTag, daysFrom, money } from './organizer';

const KEY_LABEL = { work: 'Work galleries', services: 'Services', offers: 'Offers' };

function timeAgo(iso) {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const tz = new Date().getTimezoneOffset();
    Promise.all([
      fetch(`/api/admin/stats?tz=${tz}`).then((r) => r.json()),
      fetch('/api/admin/messages?filter=inbox').then((r) => r.json()),
    ])
      .then(([s, m]) => {
        if (s.error) setError(s.error);
        else setStats(s);
        if (!m.error) setMessages(m);
      })
      .catch(() => setError('Could not load the dashboard.'));
  }, []);

  // Organizer: follow-ups due, project deadlines, open to-dos. Never fatal —
  // before the tables exist these just come back empty.
  const [todo, setTodo] = useState(null);
  useEffect(() => {
    const get = (type) =>
      fetch(`/api/admin/records?type=${type}`).then((r) => r.json()).then((d) => d.items || []).catch(() => []);
    Promise.all([get('outreach'), get('projects'), get('tasks')]).then(([o, p, t]) => {
      const rows = [];
      o.filter((r) => ['emailed', 'followed_up'].includes(r.status) && r.follow_up_on && daysFrom(r.follow_up_on) <= 0)
        .forEach((r) => rows.push({ id: `o${r.id}`, day: r.follow_up_on, text: `Follow up with ${r.company}`, href: '/admin/outreach' }));
      p.filter((r) => ['booked', 'in_progress'].includes(r.status) && r.due_on && daysFrom(r.due_on) <= 7)
        .forEach((r) => rows.push({ id: `p${r.id}`, day: r.due_on, text: `Deliver ${r.title || 'project'} for ${r.client}`, href: '/admin/projects' }));
      p.filter((r) => r.status === 'delivered' && !r.paid)
        .forEach((r) => rows.push({ id: `u${r.id}`, day: null, unpaid: true, text: `Collect payment from ${r.client}${r.price ? ` (${money(r.price)})` : ''}`, href: '/admin/projects' }));
      t.filter((r) => !r.done && (!r.due_on || daysFrom(r.due_on) <= 3))
        .forEach((r) => rows.push({ id: `t${r.id}`, day: r.due_on, text: r.title, href: '/admin/tasks' }));
      rows.sort((a, b) => (a.day || '9999').localeCompare(b.day || '9999'));
      setTodo(rows);
    });
  }, []);

  const t = stats?.traffic;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-lead">
            Traffic, inquiries and content at a glance. Edits elsewhere in the panel go live within about a minute.
          </p>
        </div>
        <div className="admin-head-actions">
          <a className="admin-mini" href="/" target="_blank" rel="noreferrer">View site ↗</a>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="stat-row">
        {!stats ? (
          <>
            <Skeleton h={112} /><Skeleton h={112} /><Skeleton h={112} /><Skeleton h={112} />
          </>
        ) : (
          <>
            <StatTile
              label="Page views · 14d"
              value={fmt(t?.totals.views ?? 0)}
              delta={t?.totals.viewsDelta}
              spark={t?.series}
            />
            <StatTile
              label="Unique visitors · 14d"
              value={fmt(t?.totals.visitors ?? 0)}
              delta={t?.totals.visitorsDelta}
              sub={t?.totals.viewsPerVisitor ? `${t.totals.viewsPerVisitor} pages/visit` : undefined}
            />
            <StatTile
              label="Unread messages"
              value={fmt(stats.messages.unread)}
              sub={`${fmt(stats.messages.total)} total`}
            />
            <StatTile
              label="Images stored"
              value={fmt(stats.images.count)}
              sub={stats.overrides.length ? `${stats.overrides.length} content override${stats.overrides.length > 1 ? 's' : ''}` : 'No overrides'}
            />
          </>
        )}
      </div>

      <Panel
        title="Needs attention"
        meta="Follow-ups, deadlines, payments and to-dos"
        actions={<a className="admin-mini" href="/admin/tasks">To-dos</a>}
      >
        {!todo ? (
          <Skeleton h={60} />
        ) : todo.length === 0 ? (
          <p className="admin-empty">Nothing due. You're caught up.</p>
        ) : (
          <div className="org-attn">
            {todo.slice(0, 8).map((r) => (
              <a key={r.id} href={r.href} className="org-attn-row">
                <span>{r.text}</span>
                {r.day ? <DueTag day={r.day} /> : r.unpaid ? <span className="org-due is-soon">Unpaid</span> : null}
              </a>
            ))}
            {todo.length > 8 && <span className="panel-meta">+{todo.length - 8} more</span>}
          </div>
        )}
      </Panel>

      <Panel title="Traffic" meta="Last 14 days">
        {!stats ? <Skeleton h={240} /> : <TrafficChart series={t?.series || []} />}
      </Panel>

      <div className="panel-grid">
        <Panel title="Top pages" meta="14 days">
          {!stats ? <Skeleton h={160} /> : (
            <BarList
              rows={t?.topPages || []}
              href={(label) => label}
              empty="No page views yet."
            />
          )}
        </Panel>
        <Panel title="Referrers" meta="14 days">
          {!stats ? <Skeleton h={160} /> : (
            <BarList
              rows={t?.referrers || []}
              href={(label) => `https://${label}`}
              empty="No external referrers yet."
            />
          )}
        </Panel>
      </div>

      <Panel
        title="Recent inquiries"
        actions={<a className="admin-mini" href="/admin/messages">Open inbox</a>}
      >
        {!messages ? (
          <Skeleton h={120} />
        ) : messages.items.length === 0 ? (
          <p className="admin-empty">No messages in the inbox.</p>
        ) : (
          <div className="msg-list">
            {messages.items.slice(0, 4).map((m) => (
              <div key={m.id} className={`msg${!m.read_at ? ' is-unread' : ''}`}>
                <div className="msg-top">
                  <span className="msg-who">{m.name}</span>
                  <span className="msg-date">{timeAgo(m.created_at)}</span>
                </div>
                <p className="msg-body clamp">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="admin-cards">
        <a className="admin-card" href="/admin/outreach">
          <h2>Outreach →</h2>
          <p>Log every company you email, see when you reached out, and never miss a follow-up.</p>
        </a>
        <a className="admin-card" href="/admin/projects">
          <h2>Projects →</h2>
          <p>Booked jobs, delivery dates, and who has (or hasn't) paid.</p>
        </a>
        <a className="admin-card" href="/admin/analytics">
          <h2>Analytics →</h2>
          <p>Traffic trends, top pages, referrers, devices and countries over 7–90 days.</p>
        </a>
        <a className="admin-card" href="/admin/images">
          <h2>Images →</h2>
          <p>Upload photos, rename them to something you'll recognize, copy URLs, or delete.</p>
        </a>
        <a className="admin-card" href="/admin/enhance">
          <h2>Enhance →</h2>
          <p>Drop in a photo for instant auto color correction, saved as a new image.</p>
        </a>
        <a className="admin-card" href="/admin/content">
          <h2>Content →</h2>
          <p>Edit every page's words — headlines, intros, team bios, terms — form or raw JSON.</p>
        </a>
      </div>

      {stats?.overrides?.length > 0 && (
        <div className="admin-note">
          <h3>Content overrides in effect</h3>
          <ul>
            {stats.overrides.map((o) => (
              <li key={o.key}>
                <strong>{KEY_LABEL[o.key] || o.key}</strong> — edited {timeAgo(o.updatedAt)}. “Reset to built-in default” on the Content page reverts it.
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats?.warnings?.length > 0 && (
        <p className="admin-lead" style={{ marginTop: 16, fontSize: 12 }}>
          Note: {stats.warnings.join(' · ')}
        </p>
      )}
    </div>
  );
}
