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

// Options for the inquiry form's optional "What can we help with?" field.
export const INQUIRY_INTERESTS = [
  'Monthly content plan',
  'One-time video',
  'Photography',
  'Event production',
  'Website build',
  'Free first-video preview',
  'Not sure yet',
];

// Buttons around the site link to the form with ?interest=<specific thing>.
// This maps that to one of the options above plus a short detail line.
export function resolveInterest(param) {
  if (!param) return null;
  if (INQUIRY_INTERESTS.includes(param)) return { interest: param, detail: '' };
  const plan = param.match(/^Monthly plan:?\s*(.*)$/i);
  if (plan) return { interest: 'Monthly content plan', detail: plan[1] ? `${plan[1]} plan` : '' };
  const site = param.match(/^Website:?\s*(.*)$/i);
  if (site) return { interest: 'Website build', detail: site[1] ? `${site[1]} website` : '' };
  const oneTime = ['Video editing (my footage)', 'One short-form video', 'Promotional video / brand film'];
  if (oneTime.includes(param)) return { interest: 'One-time video', detail: param };
  if (param === 'Event videography') return { interest: 'Event production', detail: '' };
  return null;
}

// Extra detail for the Monthly Video Plans page. The `details` answers are
// deliberately non-committal ("confirmed when you sign up") wherever the owner
// hasn't approved a specific policy yet: see HANDOFF.md for the open list.
export const MONTHLY_GUIDE = {
  modes: [
    {
      title: 'Editing-only plans',
      plans: 'Starter · Growth',
      body: 'You film, we do everything after that. Shoot clips on your phone as you work, send them over, and we turn them into finished, captioned videos.',
      points: ['No filming appointments to schedule', 'Lower monthly cost', 'Best when you or your team can grab a few clips each week'],
    },
    {
      title: 'Filming included',
      plans: 'We Capture',
      body: 'We come to you once a month with professional camera gear, film for 60–90 minutes, and edit it into the month’s videos, plus photography from the shoot.',
      points: ['Nothing for you to film', 'Professional camera and gimbal footage', 'Best when you don’t have the time or want a higher-end look'],
    },
  ],
  footageSteps: [
    { title: 'We agree how you’ll send it', body: 'When you sign up we set up a simple way for you to send clips from your phone or computer, such as a shared folder.' },
    { title: 'Send raw clips, not edits', body: 'Original files straight from your camera roll keep the best quality. No need to trim or add anything.' },
    { title: 'Add a quick note if it helps', body: 'A line about what a clip shows or what you want to promote that month helps us make the right videos.' },
  ],
  filmingTips: [
    'Film vertically (phone upright) in good, even light.',
    'Hold steady for 5–15 seconds per shot; more short clips beat one long one.',
    'Get a mix: people working, close-ups of products or details, and the space itself.',
    'If you talk to camera, film somewhere quiet and close to the phone.',
  ],
  details: [
    { q: 'How long are the videos?', a: 'Short-form, typically 15–60 seconds, cut for Instagram Reels, TikTok, Facebook and YouTube Shorts.' },
    { q: 'What do I receive?', a: 'Finished vertical (9:16) video files with captions, ready to upload. Other sizes can be discussed.' },
    { q: 'How do revisions work?', a: 'You can review each video and ask for changes. The number of revision rounds for monthly plans is confirmed when you sign up.' },
    { q: 'When is my content delivered?', a: 'We agree on a monthly delivery schedule with you during onboarding, so you know when to expect each batch.' },
    { q: 'How is the We Capture shoot scheduled?', a: 'We book your monthly session ahead of time at a time that suits your business, and plan what to film with you beforehand.' },
    { q: 'How do we stay in touch?', a: 'You deal directly with the people making your content. We agree the best way to keep in touch when you sign up.' },
    { q: 'Can I cancel?', a: 'Yes. Monthly plans can be canceled any time; cancellation takes effect at the end of the current billing period. See our terms for details.' },
  ],
};
