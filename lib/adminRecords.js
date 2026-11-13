// Shared config for the admin organizer sections (Outreach, Projects, To-dos).
// Plain data only, so both the API route (field whitelist) and the admin UI
// (labels, form inputs) can import it. Tables: supabase/admin_organizer.sql.

export const SERVICES = ['Video', 'Photography', 'Website', 'Social content', 'Other'];

export const RECORD_TYPES = {
  outreach: {
    table: 'outreach',
    order: [['contacted_on', false], ['created_at', false]],
    required: ['company'],
    fields: [
      { name: 'company', label: 'Company', type: 'text', placeholder: 'Blue Door Coffee' },
      { name: 'contact_name', label: 'Contact person', type: 'text', placeholder: 'Who you emailed' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'website', label: 'Website / Instagram', type: 'text' },
      { name: 'service', label: 'What you pitched', type: 'select', options: SERVICES, blank: '—' },
      { name: 'contacted_on', label: 'Date emailed', type: 'date', defaultToday: true },
      { name: 'follow_up_on', label: 'Follow up on', type: 'date', defaultInDays: 5 },
      {
        name: 'status', label: 'Status', type: 'select',
        options: [
          ['emailed', 'Emailed'],
          ['followed_up', 'Followed up'],
          ['replied', 'Replied'],
          ['meeting', 'Meeting set'],
          ['won', 'Won — client'],
          ['not_interested', 'Not interested'],
          ['no_reply', 'No reply / closed'],
        ],
      },
      { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
    ],
  },
  projects: {
    table: 'projects',
    order: [['created_at', false]],
    required: ['client'],
    fields: [
      { name: 'client', label: 'Client', type: 'text', placeholder: 'Business or person' },
      { name: 'title', label: 'Project', type: 'text', placeholder: 'Grand opening promo' },
      { name: 'email', label: 'Client email', type: 'email' },
      { name: 'service', label: 'Service', type: 'select', options: SERVICES, blank: '—' },
      { name: 'price', label: 'Price ($)', type: 'number' },
      { name: 'shoot_on', label: 'Shoot / start date', type: 'date' },
      { name: 'due_on', label: 'Delivery due', type: 'date' },
      {
        name: 'status', label: 'Status', type: 'select',
        options: [
          ['booked', 'Booked'],
          ['in_progress', 'Shooting / editing'],
          ['delivered', 'Delivered'],
          ['cancelled', 'Cancelled'],
        ],
      },
      { name: 'paid', label: 'Paid', type: 'checkbox' },
      { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
    ],
  },
  tasks: {
    table: 'tasks',
    order: [['done', true], ['created_at', false]],
    required: ['title'],
    fields: [
      { name: 'title', label: 'To-do', type: 'text' },
      { name: 'due_on', label: 'Due', type: 'date' },
      { name: 'done', label: 'Done', type: 'checkbox' },
    ],
  },
};

export function statusLabel(type, value) {
  const f = RECORD_TYPES[type]?.fields.find((x) => x.name === 'status');
  const opt = f?.options.find((o) => (Array.isArray(o) ? o[0] : o) === value);
  return Array.isArray(opt) ? opt[1] : value;
}

// "YYYY-MM-DD" in the viewer's local time (what <input type="date"> uses).
export function localDay(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
