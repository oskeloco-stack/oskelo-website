// One-time website builds: tiers, what's included, process and FAQ for /websites.
// Prices here are the single source for the page, the homepage teaser and /services.
// Answers are worded so nothing is promised that isn't agreed in writing per project.

export const WEBSITE_TIERS = [
  {
    name: 'Launch',
    price: '$299',
    tag: 'One page',
    bestFor: 'A clean, professional one-page site so customers can find you and get in touch.',
    features: [
      'Single scrolling page, up to 5 sections',
      'Designed around your logo and colors',
      'Looks great on phones, tablets and desktop',
      'Contact form or tap-to-call button',
      'Search basics: titles, descriptions, Google-ready',
      'Connected to your domain',
      '1 round of revisions',
    ],
  },
  {
    name: 'Business',
    price: '$699',
    tag: 'Up to 5 pages',
    featured: true,
    bestFor: 'A full small-business site: services, about, gallery and contact.',
    features: [
      'Everything in Launch',
      'Up to 5 pages (e.g. Home, Services, About, Gallery, Contact)',
      'Contact form that sends straight to your inbox',
      'Photo gallery, hours, map and social links',
      'Copy help: we shape your words into clear sections',
      'Linked to your Google Business Profile',
      '2 rounds of revisions',
    ],
  },
  {
    name: 'Signature',
    price: '$1,299',
    tag: 'Up to 10 pages',
    bestFor: 'A standout, fully custom site built to show off your photos and video.',
    features: [
      'Everything in Business',
      'Up to 10 pages, fully custom layout',
      'Video backgrounds, reels and portfolio galleries',
      'Menus, service lists, booking or quote links',
      'Page-by-page search setup',
      'Visitor stats so you can see what’s working',
      '3 rounds of revisions + a launch walkthrough',
    ],
  },
];

export const WEBSITE_INCLUDED = [
  { title: 'Mobile-first', body: 'Most of your customers will see it on a phone, so that’s where we start.' },
  { title: 'Fast loading', body: 'Optimized images and lean pages, so nobody leaves while it loads.' },
  { title: 'Found on Google', body: 'Proper titles, descriptions and structure so search engines understand your business.' },
  { title: 'Built to convert', body: 'Clear calls to action on every page: call, email, book or request a quote.' },
  { title: 'Your brand, not a template', body: 'Your logo, colors and voice, laid out so it feels like your business.' },
  { title: 'One price, paid once', body: 'A fixed price for the build, agreed before we start. No monthly fee to OSKELO.' },
];

export const WEBSITE_STEPS = [
  { title: 'Quick call', body: 'We talk about your business, who your customers are and what the site needs to do.' },
  { title: 'Design', body: 'We lay out the look and structure using your brand, and you approve the direction.' },
  { title: 'Build & revise', body: 'We build the site, you review it on a private preview link, and we make your changes.' },
  { title: 'Launch', body: 'We connect your domain, double-check every page and put it live.' },
];

export const WEBSITE_FAQ = [
  {
    q: 'What do I need to have ready?',
    a: 'Your logo, any photos you want to use, and a rough idea of what you want to say. If you don’t have photos, we can shoot them for you (see Photography).',
  },
  {
    q: 'Do I need my own domain and hosting?',
    a: 'If you already have a domain, we connect it. If not, we help you pick and register one in your name. Any domain or hosting costs from those providers are separate from the build price and are confirmed with you before we start.',
  },
  {
    q: 'How long does a build take?',
    a: 'It depends on the size of the site and how quickly content comes together. We give you a timeline when we agree the scope, before any work begins.',
  },
  {
    q: 'Who owns the site when it’s done?',
    a: 'The site is built for your business. Exactly what you receive at handover is written into your project agreement so there are no surprises.',
  },
  {
    q: 'Can you add video and photos to it?',
    a: 'Yes, that’s what we do. Pair your build with a one-time shoot, a promo video or a monthly content plan and your site launches with real content instead of stock photos.',
  },
  {
    q: 'What if I need more than 10 pages or something custom?',
    a: 'Online stores, larger sites and special features are quoted separately. Tell us what you have in mind and we’ll scope it with you.',
  },
];
