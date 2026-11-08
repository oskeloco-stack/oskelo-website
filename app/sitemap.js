import { SERVICES } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';

const BASE = 'https://www.oskelo.com';

export default function sitemap() {
  const pages = ['', '/video', '/services', '/websites', '/work', '/about', '/offers', '/contact', '/terms'];
  const services = SERVICES.map((s) => `/services/${s.slug}`);
  const work = WORK_CATEGORIES.flatMap((c) => [
    `/work/${c.slug}`,
    ...(c.items || []).filter((i) => i.slug).map((i) => `/work/${c.slug}/${i.slug}`),
  ]);

  return [...pages, ...services, ...work].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/services') ? 0.9 : 0.6,
  }));
}
