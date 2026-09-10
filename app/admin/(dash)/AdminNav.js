'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/browser';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/images', label: 'Images' },
  { href: '/admin/content', label: 'Content' },
];

export default function AdminNav({ email }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <aside className="admin-nav">
      <div className="admin-brand">
        <a href="/" target="_blank" rel="noreferrer">Oskelo</a>
        <span>Admin</span>
      </div>
      <nav>
        {LINKS.map((link) => {
          const active =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              className={active ? 'is-active' : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
      <div className="admin-nav-foot">
        <span className="admin-email" title={email}>{email}</span>
        <button type="button" onClick={logOut}>Log out</button>
      </div>
    </aside>
  );
}
