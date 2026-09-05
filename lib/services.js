export const TRAVEL_NOTE =
  'On-location pricing generally includes travel within approximately 15 miles of our service area. Additional travel or location-related fees may apply depending on distance, travel time, project requirements, accessibility, or other circumstances. Any additional charges will be discussed and approved before the project is confirmed.';

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
        price: 'Starting at $799/mo',
        travel: true,
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
    travel: true,
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
    subtitle: 'A single polished video, from a quick edit to a full production.',
    type: 'plans',
    plans: [
      {
        name: 'Edit',
        price: '$99',
        features: [
          '1 professionally edited short-form video',
          'Uses footage you send',
          'Color grade & sound mix',
          '1 round of revisions',
        ],
      },
      {
        name: 'Capture + Short',
        price: 'Starting at $299',
        featured: true,
        travel: true,
        features: [
          'Up to 60-minute on-site session',
          '1 professionally edited short-form video',
          'Color grade & sound mix',
          '1 round of revisions',
        ],
      },
      {
        name: 'Signature Video',
        price: 'Starting at $599',
        travel: true,
        features: [
          '1–2 hour on-site production session',
          '60–120 sec promotional/brand video',
          'Full edit & color grade',
          '2 rounds of revisions',
        ],
      },
    ],
  },
];

export function getService(slug) {
  return SERVICES.find((service) => service.slug === slug);
}
