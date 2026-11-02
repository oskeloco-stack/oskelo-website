import './globals.css';
import PromoBar from './components/PromoBar';
import Analytics from './components/Analytics';

// PromoBar reads admin-edited content; this keeps it (and any other
// layout-level Supabase reads) refreshing on the same cadence as the rest of
// the content-driven pages. Routes with a stricter config of their own (e.g.
// /admin's force-dynamic) still take precedence for that subtree.
export const revalidate = 60;

const SITE_URL = 'https://www.oskelo.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OSKELO | Video Production & Content Creation in Lancaster, PA',
    template: '%s | OSKELO',
  },
  description:
    'You run your business. We run your content. Short-form video, social media videography, editing and photography for small businesses in Lancaster, PA.',
  openGraph: {
    type: 'website',
    siteName: 'OSKELO',
    locale: 'en_US',
    url: '/',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'OSKELO: You run your business. We run your content.' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};

// Structured data for local search. Only verified facts: no street address,
// phone or reviews until they exist.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'OSKELO',
  slogan: 'You run your business. We run your content.',
  url: SITE_URL,
  email: 'contact@oskelo.com',
  image: `${SITE_URL}/og.jpg`,
  logo: `${SITE_URL}/4.webp`,
  priceRange: '$$',
  areaServed: [
    { '@type': 'City', name: 'Lancaster', containedInPlace: { '@type': 'State', name: 'Pennsylvania' } },
    { '@type': 'AdministrativeArea', name: 'Lancaster County, PA' },
    ...['Lititz', 'Ephrata', 'Manheim', 'Mount Joy', 'Elizabethtown', 'Millersville', 'Strasburg', 'Columbia']
      .map((name) => ({ '@type': 'City', name, containedInPlace: { '@type': 'State', name: 'Pennsylvania' } })),
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Lancaster', addressRegion: 'PA', addressCountry: 'US' },
  knowsAbout: ['Video production', 'Short-form video editing', 'Social media videography', 'Business photography', 'Event videography'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <PromoBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
