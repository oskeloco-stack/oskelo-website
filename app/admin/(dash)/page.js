export const metadata = { title: 'Dashboard — Oskelo Admin' };

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p className="admin-lead">
        Manage the site without redeploying. Edits go live within about a minute.
      </p>

      <div className="admin-cards">
        <a className="admin-card" href="/admin/images">
          <h2>Images</h2>
          <p>Upload photos and copy their URLs, or delete ones you no longer need.</p>
        </a>
        <a className="admin-card" href="/admin/content">
          <h2>Content</h2>
          <p>
            Edit the Work galleries, Services, and Offers — with a form for the
            common cases and raw JSON for everything else.
          </p>
        </a>
      </div>

      <div className="admin-note">
        <h3>How edits reach the live site</h3>
        <ul>
          <li>Saving writes to Supabase. Public pages re-read it at most once a minute.</li>
          <li>
            Adding a brand-new collection or service <em>slug</em> still needs a
            deploy before its own page pre-builds; existing pages update on their own.
          </li>
          <li>The header/footer navigation is still set in code (not editable here yet).</li>
        </ul>
      </div>
    </div>
  );
}
