// Default (built-in) copy for every page/section that the admin Content editor
// can override, one export per `site_content` key. Each matches exactly what
// was hardcoded in the page before it became editable, so nothing changes
// visually until someone actually edits it in /admin/content.
//
// Structural things (which component renders where, hrefs, image props that
// come from a specific page's own layout) stay as real props, not content —
// only words do.

export const HOME_DEFAULT = {
  heroEyebrow: 'Video & photo for businesses, individuals & events',
  heroHeadingLine1: 'Content built',
  heroHeadingLine2: 'to stand out',
  heroCta1Label: 'See the packages',
  heroCta2Label: 'View our work',
  offersEyebrow: 'Services',
  offersHeading: 'What we offer',
  offersIntro: 'Three ways to work with us. Tap through for full details and pricing.',
  missionEyebrow: 'What we do',
  missionHeading: 'Our mission',
  missionBody1:
    'Oskelo makes video and photography for businesses, individuals, and events — brand films, portraits, product shoots, and event coverage.',
  missionBody2:
    'Hand us your footage to edit, or have us on-site to shoot and produce the whole piece. Either way the goal is the same: content built to stand out, made simple to get.',
  workEyebrow: 'Selected work',
  workHeading: 'Recent projects',
  workIntro: 'A short survey of business and brand work delivered in the last year.',
  reelsEyebrow: 'In motion',
  reelsHeading: 'Short-form, built for scroll',
  reelsIntro: 'A preview of the vertical video content we create for social feeds.',
};

export const ABOUT_DEFAULT = {
  eyebrow: 'About',
  headingLine1: 'Focused on your',
  headingLine2: "business's growth",
  intro:
    'A small, dedicated crew committed to helping your business stand out — from first call to final cut.',
  team: [
    {
      name: 'David Becker',
      role: 'Owner and Founder',
      bio: 'Leads every shoot and signs off on the final cut of each project.',
    },
    {
      name: 'Charity Reist',
      role: 'Photographer',
      bio: 'Captures the stills that bring each brand story to life.',
    },
    {
      name: 'David Oconnel',
      role: 'Videographer and Editor',
      bio: 'Films on-site and edits raw footage into the final cut.',
    },
  ],
};

export const CONTACT_PAGE_DEFAULT = {
  eyebrow: 'Contact',
  heading: 'We want you to look as good as your work',
  intro: "Have a project in mind? We'd love to hear about it.",
  body:
    "At Oskelo, we believe every business — and every person behind it — deserves to look as good as the work they actually do. We started this studio because too many talented business owners were stuck with content that didn't reflect the quality of what they offer. Our mission is simple: help businesses and individuals put their best foot forward through video and photography that feels polished, personal, and true to who they are. Whether you're a growing brand, a small business owner, or someone who just wants their story told well, we'd love to help you look — and feel — like the best version of yourselves.",
};

export const FOUNDING_OFFER_DEFAULT = {
  eyebrow: 'Monthly Rate Lock',
  heading: 'Lock in your rate for good',
  body:
    "Start any monthly plan this month and, if you're one of the first 5 to sign up, today's rate is grandfathered in for as long as you stay subscribed — even after our prices go up. What you pay now is what you pay for good.",
  ctaLabel: 'Claim your spot',
};

export const PROMO_BAR_DEFAULT = {
  message: 'Start any monthly plan this month and keep today’s rate for good — limited to 5 spots',
};

export const FOOTER_DEFAULT = {
  copyright: '© 2026 Oskelo',
  location: 'Pennsylvania',
  termsLabel: 'Terms',
};

// The final "Contact" section (with the mailto: link) is intentionally not
// part of this list — it stays fixed in app/terms/page.js so the email link
// can't be broken by a plain-text edit. Everything else here is editable.
export const TERMS_DEFAULT = {
  eyebrow: 'Legal',
  heading: 'Terms & Conditions',
  lastUpdated: 'Last Updated: September 5, 2026',
  intro: 'Questions about anything below? Reach us at the email at the bottom of this page.',
  sections: [
    {
      heading: 'Our Services',
      body: 'OSKELO provides video creation services for businesses, including monthly short-form video plans, one-time on-site shoots, and one-time edited videos. The scope, deliverables, and pricing for each service are described on our Services pages and confirmed with you before work begins.',
    },
    {
      heading: 'Scheduling & Rescheduling',
      body: 'On-location shoots must be scheduled in advance. If you need to reschedule, please give us as much notice as possible — ideally at least 24–48 hours. Because shoots often involve reserved time, travel, and sometimes outside contractors, OSKELO may charge a rescheduling or cancellation fee when significant time, travel, or other resources have already been committed to your shoot. Any such fee will be communicated to you before it applies.',
    },
    {
      heading: 'Weather & On-Site Conditions',
      body: "Some shoots depend on conditions outside our control. OSKELO may reschedule or adjust an on-location shoot due to weather, unsafe conditions, property access issues, or other circumstances that would affect safety or the quality of the final production. Rescheduling for these reasons isn't a failure to perform the service, and we'll work with you to find a new time as soon as reasonably possible.",
    },
    {
      heading: 'Travel & On-Location Fees',
      body: "On-location pricing generally includes reasonable travel within approximately 15 miles of OSKELO's normal service area. This distance is a guideline, not a guarantee — being within 15 miles doesn't automatically mean no additional charges will apply. Additional fees may apply based on distance, travel time, parking, tolls, accessibility, unusual location requirements, or other project-specific circumstances. Any additional charges will always be disclosed and approved before your project is confirmed.",
    },
    {
      heading: 'Turnaround Times',
      body: 'We may provide an estimated turnaround time for your project, but unless a specific delivery date has been agreed to in writing, these are estimates rather than guarantees. OSKELO makes reasonable efforts to meet the timelines we communicate to you.',
    },
    {
      heading: 'Client Delays',
      body: "Production and delivery timelines depend in part on you. If OSKELO is waiting on footage, information, site access, approvals, revision feedback, or other materials from you, your project's timeline may be extended accordingly.",
    },
    {
      heading: 'Payment & Billing',
      body: 'Monthly plans are billed on a recurring monthly basis starting on the date your subscription begins. One-time projects require payment in full, or an agreed deposit, before work begins unless otherwise arranged in writing. Prices listed on our site are starting prices for standard scopes — final pricing for any project is confirmed with you in advance.',
    },
    {
      heading: 'Payment Protection',
      body: 'If an invoice or required payment becomes overdue, OSKELO may pause production, withhold final deliverables, or suspend recurring services until the outstanding balance is paid. Work resumes once payment is received.',
    },
    {
      heading: 'Cancellation',
      body: "You may cancel a monthly plan at any time; cancellation takes effect at the end of your current billing period, and no partial refunds are issued for time already billed. Founding member pricing applies only for as long as a subscription remains active without lapsing — if a subscription is canceled and later restarted, current pricing will apply.",
    },
    {
      heading: 'Revisions',
      body: 'Each package includes a set number of revision rounds, listed on the relevant Services page, covering reasonable changes within the originally agreed project scope. Major creative changes, additional deliverables, reshoots, or requests that materially change the original project may be treated as additional work and quoted separately.',
    },
    {
      heading: 'Raw Footage',
      body: "Raw, unedited footage isn't automatically included with a finished-video package unless the package specifically says so, or OSKELO and you agree to it separately. Raw footage may be made available for an additional fee.",
    },
    {
      heading: 'Client-Provided Footage',
      body: 'For services using footage you provide, you confirm that you own or have the rights to use that footage, and any music, images, or other content you supply. You agree to hold OSKELO harmless from any claims arising from content you provide.',
    },
    {
      heading: 'Ownership & Usage Rights',
      body: "Once a project is paid in full, you may use your final delivered content for your intended business, personal, and social-media purposes. Third-party materials used in your project — such as licensed music, fonts, stock footage, graphics, or other assets — remain subject to their own licenses and aren't transferred to you or OSKELO as owned intellectual property. OSKELO retains the right to display completed work in our portfolio, website, social media, advertising, and other promotional materials, unless you request otherwise in writing.",
    },
    {
      heading: 'Music & Third-Party Licensing',
      body: "OSKELO may use properly licensed music, stock footage, fonts, graphics, or other third-party materials in your project. These materials remain governed by their own licenses. Please don't extract, redistribute, resell, or use these third-party assets separately from your delivered work unless you independently hold the appropriate rights to do so.",
    },
    {
      heading: 'No Performance Guarantee',
      body: 'OSKELO provides content creation and production services. We do not guarantee specific business or social-media results, including but not limited to views, followers, engagement, leads, customers, sales, revenue, conversions, virality, or platform reach. How content performs after delivery depends on many factors outside our control.',
    },
    {
      heading: 'Limitation of Liability',
      body: "OSKELO will make every reasonable effort to deliver quality work on schedule. To the extent permitted by law, OSKELO's liability for any claim related to our services is limited to the amount you paid for the project in question.",
    },
    {
      heading: 'Changes to These Terms',
      body: "We may update these Terms & Conditions from time to time. Updated terms apply to future purchases, renewals, or services entered into after the update takes effect, and don't change the terms of a project you've already agreed to with us, unless we separately agree otherwise with you.",
    },
  ],
};
