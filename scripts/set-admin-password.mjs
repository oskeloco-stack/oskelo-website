// Set a new password for the admin login (ADMIN_EMAIL) without deleting the user.
// Run from the website folder:
//   node --env-file=.env.local scripts/set-admin-password.mjs
// The password is typed into this terminal only (hidden) and sent straight to
// Supabase. It is never printed, logged or saved anywhere.

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL || 'oskelo.co@gmail.com').toLowerCase();

if (!url || !key) {
  console.error('Missing Supabase keys. Run with: node --env-file=.env.local scripts/set-admin-password.mjs');
  process.exit(1);
}

function askHidden(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    let value = '';
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (ch) => {
      if (ch === '\r' || ch === '\n' || ch === '\u0004') {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(value);
      } else if (ch === '\u0003') {
        process.stdout.write('\nCancelled.\n');
        process.exit(1);
      } else if (ch === '\u007f' || ch === '\b') {
        if (value.length) process.stdout.write('\b \b');
        value = value.slice(0, -1);
      } else {
        value += ch;
        process.stdout.write('*'.repeat(ch.length));
      }
    };
    stdin.on('data', onData);
  });
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

let user = null;
for (let page = 1; page <= 10 && !user; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) { console.error('Could not reach Supabase:', error.message); process.exit(1); }
  user = data.users.find((u) => u.email?.toLowerCase() === email);
  if (data.users.length < 200) break;
}
if (!user) { console.error(`No login found for ${email}.`); process.exit(1); }

console.log(`Setting a new password for ${email}. Click here, type, and you'll see * for each letter.`);
const pw1 = await askHidden('New password: ');
if (pw1.length < 8) { console.error('Use at least 8 characters. Nothing was changed.'); process.exit(1); }
const pw2 = await askHidden('Type it again: ');
if (pw1 !== pw2) { console.error("They didn't match. Nothing was changed."); process.exit(1); }

const { error } = await supabase.auth.admin.updateUserById(user.id, { password: pw1 });
if (error) { console.error('Supabase refused it:', error.message); process.exit(1); }
console.log('Done. Sign in at https://www.oskelo.com/admin with your new password.');
process.exit(0);
