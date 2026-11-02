export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/preview', '/api'] },
    sitemap: 'https://www.oskelo.com/sitemap.xml',
  };
}
