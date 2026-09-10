import { createClient } from './supabase/server';

// The single email allowed into the admin area. Everything else with a valid
// Supabase session is still rejected — this is the real authorization check,
// since the Supabase project could technically have other auth users.
export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || 'oskelo.co@gmail.com').toLowerCase();
}

// Returns the signed-in Supabase user if they are the admin, otherwise null.
// Use from the admin layout (redirect on null) and from every /api/admin route
// handler (401 on null).
export async function getAdminUser() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;
  if (user.email.toLowerCase() !== getAdminEmail()) return null;
  return user;
}
