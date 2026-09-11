import { NextResponse } from 'next/server';
import { getAdminUser } from '../../../../lib/adminAuth';
import { fetchEvents, parseRangeDays } from '../../../../lib/analyticsQuery';
import { aggregate } from '../../../../lib/analytics';

export const dynamic = 'force-dynamic';

// GET /api/admin/analytics?range=30d&tz=<minutes from Date.getTimezoneOffset()>
// Returns the full analytics roll-up for the dashboard's Analytics page.
export async function GET(request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

  const url = new URL(request.url);
  const days = parseRangeDays(url.searchParams.get('range'));
  const tzOffsetMinutes = Math.max(
    -840,
    Math.min(840, parseInt(url.searchParams.get('tz') || '0', 10) || 0)
  );

  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - days * 86400000);
  const prevStart = new Date(windowStart.getTime() - days * 86400000);

  try {
    const rows = await fetchEvents(prevStart);
    const data = aggregate(rows, { windowStart, windowEnd, prevStart, tzOffsetMinutes });
    return NextResponse.json({
      range: `${days}d`,
      generatedAt: windowEnd.toISOString(),
      ...data,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
