export const SERVICES = [
  {
    slug: 'monthly-plans',
    title: 'Monthly Video Plans',
    subtitle: 'Ongoing short-form content, delivered every month.',
    type: 'plans',
    plans: [
      {
        name: 'Starter',
        price: '$299/mo',
        features: [
          '4 short-form videos per month',
          'Uses footage you send',
          'Professional editing & hooks',
          'On-screen text & captions',
          'Ready-to-post delivery',
        ],
      },
      {
        name: 'Growth',
        price: '$499/mo',
        featured: true,
        features: [
          '8 short-form videos per month',
          'Uses footage you send',
          'Editing, hooks & captions',
          'Content ideas & direction',
          'Ready-to-post delivery',
        ],
      },
      {
        name: 'We Capture',
        price: '$799/mo',
        features: [
          'One 60–90 min on-site shoot/month',
          'Pro camera + gimbal footage & photography',
          '8 short-form videos per month',
          'Editing, captions & content direction',
          'Ready-to-post delivery',
        ],
      },
    ],
  },
  {
    slug: 'one-time-shoot',
    title: 'One-Time Shoot',
    subtitle: 'On-site filming for a single project or event.',
    type: 'simple',
    price: 'Contact us for a quote',
    features: [
      'On-site filming, half day or full day',
      'Full edit & color grade',
      'Every shoot is scoped individually',
      'Pricing depends on length, location & deliverables',
    ],
    cta: true,
  },
  {
    slug: 'one-time-video',
    title: 'One-Time Video',
    subtitle: 'A single polished video from footage you already have.',
    type: 'simple',
    price: '$500',
    features: [
      'You send the raw footage',
      'Up to 3 minutes, final cut',
      'Color grade & sound mix',
      '2 rounds of revisions',
    ],
  },
];

export function getService(slug) {
  return SERVICES.find((service) => service.slug === slug);
}
