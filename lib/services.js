export const TRAVEL_NOTE =
  'On-location pricing generally includes travel within approximately 15 miles of our service area. Additional travel or location-related fees may apply depending on distance, travel time, project requirements, accessibility, or other circumstances. Any additional charges will be discussed and approved before the project is confirmed.';

// Prices and deliverables here are the published ones. Change them only with
// the owner's sign-off. `footage` is 'client' (you send it) or 'onsite' (we film).
// `specs` drives the plan comparison table and must agree with `features`.
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
        footage: 'client',
        bestFor: 'Owners who already film on their phone and want it turned into polished posts.',
        features: [
          '4 short-form videos per month',
          'Uses footage you send',
          'Professional editing & hooks',
          'On-screen text & captions',
          'Ready-to-post delivery',
        ],
        specs: { videos: '4', footage: 'You send it', shoot: false, captions: true, direction: false, photos: false },
      },
      {
        name: 'Growth',
        price: '$499/mo',
        featured: true,
        footage: 'client',
        bestFor: 'Businesses ready to post twice a week and want help deciding what to film.',
        features: [
          '8 short-form videos per month',
          'Uses footage you send',
          'Editing, hooks & captions',
          'Content ideas & direction',
          'Ready-to-post delivery',
        ],
        specs: { videos: '8', footage: 'You send it', shoot: false, captions: true, direction: true, photos: false },
      },
      {
        name: 'We Capture',
        price: 'Starting at $799/mo',
        travel: true,
        footage: 'onsite',
        bestFor: 'Businesses with no time to film. We come to you once a month and handle everything.',
        features: [
          'One 60–90 min on-site shoot/month',
          'Pro camera + gimbal footage & photography',
          '8 short-form videos per month',
          'Editing, captions & content direction',
          'Ready-to-post delivery',
        ],
        specs: { videos: '8', footage: 'We film on-site', shoot: true, captions: true, direction: true, photos: true },
      },
    ],
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
        footage: 'client',
        bestFor: 'Video editing from your own footage.',
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
        footage: 'onsite',
        bestFor: 'We film and produce one short-form video.',
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
        footage: 'onsite',
        bestFor: 'Promotional videos and brand films.',
        features: [
          '1–2 hour on-site production session',
          '60–120 sec promotional/brand video',
          'Full edit & color grade',
          '2 rounds of revisions',
        ],
      },
    ],
  },
  {
    slug: 'one-time-shoot',
    title: 'Events & Custom Projects',
    subtitle: 'Event videography and custom productions, scoped to your project.',
    type: 'simple',
    price: 'Contact us for a quote',
    travel: true,
    features: [
      'Event videography, half day or full day',
      'Custom productions beyond our standard packages',
      'Full edit & color grade',
      'Every project is scoped individually',
      'Pricing depends on length, location & deliverables',
    ],
    cta: true,
  },
  {
    slug: 'photography',
    title: 'Photography',
    subtitle: 'Business, portrait and event photography.',
    type: 'simple',
    price: 'Contact us for a quote',
    travel: true,
    features: [
      'Headshots, team and business photography',
      'Portraits and event coverage',
      'Edited, high-resolution images',
      'Pricing depends on length, location & deliverables',
    ],
    cta: true,
  },
];

// `services` lets a page pass in the admin-edited content (from getContent);
// it defaults to the built-in SERVICES so existing callers keep working.
export function getService(slug, services = SERVICES) {
  return services.find((service) => service.slug === slug);
}

// Everything that isn't a monthly plan, flattened into one list of purchasable
// options for the "one-time projects" grids. Also used by the inquiry form.
export function oneTimeOptions(services = SERVICES) {
  return services
    .filter((service) => service.slug !== 'monthly-plans')
    .flatMap((service) =>
      service.type === 'plans'
        ? service.plans.map((plan) => ({
            name: plan.name,
            price: plan.price,
            detail: plan.bestFor || plan.features[0],
            href: `/services/${service.slug}`,
            footage: plan.footage,
          }))
        : [{
            name: service.title,
            price: 'Quote',
            detail: service.subtitle,
            href: `/services/${service.slug}`,
            footage: 'onsite',
          }]
    );
}

// Options for the inquiry form's "What are you interested in?" field.
export const INQUIRY_INTERESTS = [
  'Monthly plan: Starter',
  'Monthly plan: Growth',
  'Monthly plan: We Capture',
  'Free first-video preview',
  'Video editing (my footage)',
  'One short-form video',
  'Promotional video / brand film',
  'Event videography',
  'Photography',
  'Something else',
];
