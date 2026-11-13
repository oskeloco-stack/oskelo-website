// Default (built-in) copy for every page/section that the admin Content editor
// can override, one export per `site_content` key. Each matches exactly what
// was hardcoded in the page before it became editable, so nothing changes
// visually until someone actually edits it in /admin/content.
//
// Structural things (which component renders where, hrefs, image props that
// come from a specific page's own layout) stay as real props, not content —
// only words do.

export const HOME_DEFAULT = {
  // ---- Studio homepage (2026-11-09 redesign) ----
  studioPlace: 'A Pennsylvania-based creative studio for local businesses.',
  studioHeadline1: 'Your story.',
  studioHeadline2: 'Worth watching.',
  studioSub: 'Cinematic video and short-form content for businesses doing great things.',
  studioFeaturedEyebrow: 'Selected work',
  studioWhatEyebrow: 'What we do',
  studioWhatHeading: 'Content that helps local businesses grow.',
  studioWhatIntro: 'Video built for real businesses, from ongoing social content to cinematic brand stories.',
  studioMonthlyBody: 'A steady flow of edited short-form video every month, from your footage or ours.',
  studioVideoBody: 'Promo videos, brand films, event coverage and single edits that show what makes you different.',
  studioEventBody: 'Car shows, church events, fundraisers and launches, filmed and cut into a promo or recap.',
  studioPhotoBody: 'Professional, natural photography of your people, products, space and events.',
  studioWhyEyebrow: 'Why OSKELO',
  studioWhyHeading: 'You run your business. We run your content.',
  studioWhyBody: 'Most business owners know they should be posting more. Few have the time to plan it, film it and edit it well. That’s the job we take off your plate, so you can keep doing the work you’re good at.',
  studioWhyPoints: [
    { title: 'Authentic storytelling', body: 'Real people and real work, not trend templates. Your content should look like your business, because it is.' },
    { title: 'Quality production', body: 'Professional cameras, careful editing, color and sound. Every piece gets a final look before it goes out.' },
    { title: 'A straightforward process', body: 'Clear prices, one person to talk to, and finished files you can post the day they arrive.' },
  ],
  studioPricingEyebrow: 'Monthly plans',
  studioPricingHeading: 'Consistent content, one simple monthly price.',
  studioPricingIntro: 'Send us your footage, or have us film on-site. Either way, you get finished videos ready to post.',
  studioStepsEyebrow: 'How it works',
  studioStepsHeading: 'Three steps. No runaround.',
  studioSteps: [
    { title: 'Tell us about your project.', body: 'A short form or a quick email: what your business does and what you need.' },
    { title: 'We film, edit, or work with your footage.', body: 'We plan the content with you, then shoot on location or cut what you send.' },
    { title: 'Receive finished content, ready to use.', body: 'Captioned, color-graded files sized for the platforms you post on.' },
  ],
  studioCtaHeading: 'Good work deserves to be seen.',
  studioCtaBody: 'Let’s create content that tells your story, connects with your audience and shows the work you actually do.',

  heroEyebrow: 'Video & content production · Lancaster, PA',
  heroHeadingLine1: 'You run your business.',
  heroHeadingLine2: 'We run your content.',
  heroSub:
    'Filming, editing, photography and ongoing short-form content for businesses that want to look their best online.',
  heroCta1Label: 'Explore Our Plans',
  heroCta2Label: 'See Our Work',

  whyEyebrow: 'What we do',
  whyHeading: 'Content production, handled',
  whyIntro:
    'You focus on your customers. We plan, film, edit and deliver the content that shows them what you do.',
  whatCta: 'Services & pricing',
  whyPoints: [
    { title: 'Short-form video', body: 'Vertical videos for Reels, TikTok, Facebook and Shorts, edited with hooks and captions.' },
    { title: 'On-site filming', body: 'We come to your business with professional camera gear, so you never have to film.' },
    { title: 'Editing', body: 'Send us clips from your phone and we turn them into polished, ready-to-post videos.' },
    { title: 'Photography', body: 'Business, portrait and event photos for your website, socials and marketing.' },
  ],

  packagesEyebrow: 'Monthly plans',
  packagesHeading: 'Content every month, handled',
  packagesIntro:
    'Starter and Growth turn footage you send into finished posts. We Capture adds a monthly shoot, so you never have to film.',
  packagesOneTimeLabel: 'One-time projects',
  packagesOneTimeIntro: 'Not ready for a monthly plan? Every service is also available as a single project.',
  oneTimeHeading: 'Single videos, events & photography',
  photoHeading: 'Photography',

  introEyebrow: 'Getting started',
  introHeading: 'See what OSKELO can do for your business.',
  introBody:
    'Businesses starting a monthly plan can get their first video as a free preview, so you see our work on your business before your first monthly payment.',
  introConditions: [
    'For new businesses starting a Starter, Growth or We Capture plan.',
    'We agree on your plan, start date and the preview video’s scope on a short call first.',
    'One preview per business, at our discretion.',
    'We make great content; we can’t promise specific views, followers or sales.',
  ],
  introCta: 'Ask about the preview',

  stepsEyebrow: 'How it works',
  stepsHeading: 'Three steps to consistent content',
  steps: [
    { title: 'Tell us about your business', body: 'A quick conversation about your goals, your customers and the content you need.' },
    { title: 'We plan, film and edit', body: 'Depending on your plan, we film on location or work from footage you send, then edit everything.' },
    { title: 'You post. We keep it coming.', body: 'Finished videos arrive ready to publish, and monthly clients get a fresh batch every month.' },
  ],

  valuesEyebrow: 'What OSKELO stands for',
  valuesHeading: 'Six letters we actually work by',
  valuesIntro: 'The name is the brief. Every project we take on gets measured against these.',
  values: [
    { letter: 'O', word: 'Original', body: 'Nothing copy-pasted from a trend template. Your content should look like you, not everyone else.' },
    { letter: 'S', word: 'Sincere', body: 'We tell your story the way it really is. Real people and real work come across better than a script.' },
    { letter: 'K', word: 'Kinetic', body: 'Movement, pacing and sound that hold attention past the first second.' },
    { letter: 'E', word: 'Engaging', body: 'Made for the people you want to reach, so they stop, watch and remember you.' },
    { letter: 'L', word: 'Lasting', body: 'Quality that still looks good next year, not just this week.' },
    { letter: 'O', word: 'Organic', body: 'Natural storytelling instead of forced, overproduced marketing.' },
  ],

  workEyebrow: 'Selected work',
  workHeading: 'Recent projects',
  workCta: 'Explore the full portfolio',
  workIntro: 'Photography and video we have produced. Every piece here is our own work.',
  reelsEyebrow: 'In motion',
  reelsHeading: 'Short-form, built for scroll',
  reelsIntro: 'Vertical promos we filmed and edited for a local community event.',

  closingHeading: 'Have something in mind? Let’s make it happen.',
  closingBody: 'Tell us about your business or project. We usually reply within one business day.',
  closingCta: 'Get in Touch',

  // "Welcome" homepage (2026-11). New keys, so any older saved homepage copy
  // in Supabase can't override the new layout's words.
  welcomeEyebrow: 'Lancaster, PA · Video & websites',
  welcomeHeading: 'We help local businesses look great online.',
  welcomeSub:
    'We film and edit videos people actually watch, and build simple websites that turn visitors into customers. Friendly, local and easy to work with.',
  welcomeCta1: 'Get in touch',
  welcomeCta2: 'See our work',
  welcomeNote: 'Free, no-pressure chat. We usually reply within one business day.',

  offerEyebrow: 'What we do',
  offerHeading: 'Two things, done really well.',
  videoTitle: 'Videography & editing',
  videoBody:
    'We come to your business and film, or you send us clips from your phone. Either way, you get polished, ready-to-post videos.',
  videoPoints: ['Monthly content plans', 'One-time promo videos', 'Event videography', 'Editing from your own footage'],
  videoCta: 'Explore video',
  webTitle: 'Website design',
  webBody:
    'A clean, custom website for your business, built once at a fixed price. Easy for your customers to use and ready for your photos and video.',
  webPoints: ['One-page sites', 'Full business websites', 'Works great on phones', 'Fixed price, paid once'],
  webCta: 'Explore websites',

  showEyebrow: 'Recent work',
  showHeading: 'A few things we’ve made',
  showCta: 'See all our work',

  easyEyebrow: 'How it works',
  easyHeading: 'Simple from start to finish',
  easySteps: [
    { title: 'Say hello', body: 'Tell us a little about your business and what you need. No forms full of jargon.' },
    { title: 'We get to work', body: 'We plan, film, edit or build, and keep you in the loop the whole way.' },
    { title: 'You share it', body: 'You get finished videos ready to post, or a website ready to go live.' },
  ],
};

export const ABOUT_DEFAULT = {
  eyebrow: 'About',
  headingLine1: 'The person behind',
  headingLine2: 'OSKELO',
  intro:
    'A small, Christian-owned video and web business in the Lancaster, PA area, here to help local businesses look as good online as the work they actually do.',
  storyHeading: 'Why I started',
  story:
    'Plenty of businesses and people do great work that never shows up well online. Not because they don’t care, but because filming, editing and building a website is a job of its own. OSKELO started to take that job off their hands, so they can present their work properly without managing it all themselves.',

  faithEyebrow: 'Our foundation',
  faithHeading: 'A Christian business, built to serve.',
  faithBody: [
    'OSKELO is a Christian business. My faith in Jesus is the reason I do this work the way I do: honestly, carefully, and with the people I work with in mind first.',
    'For me, serving others isn’t a slogan. It means telling you the truth about what you need (and what you don’t), treating your business like it matters, and doing work I’d be proud to put my name on.',
    'Whether or not you share my faith, you’ll be treated with the same care and respect.',
  ],
  faithVerse: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.',
  faithVerseRef: 'Colossians 3:23',

  meaningEyebrow: 'The name',
  meaningHeading: 'What OSKELO means',
  meaningIntro: 'Every letter is something I hold each project to.',

  promisesHeading: 'What working with OSKELO looks like',
  promises: [
    { title: 'You talk to the maker', body: 'No account managers or hand-offs. The person you speak with is the one filming, editing and building.' },
    { title: 'Every project gets a final look', body: 'I review everything before it goes out, so quality stays consistent.' },
    { title: 'Local and hands-on', body: 'Based in the Lancaster, PA area, and happy to come to you for shoots.' },
  ],
  team: [
    {
      name: 'David Becker',
      role: 'Owner and Founder',
      bio: 'Films, edits and builds every project, and personally signs off on each one before it goes out.',
      photo: '',
    },
  ],
};


export const CONTACT_PAGE_DEFAULT = {
  eyebrow: 'Contact',
  heading: 'Let’s talk about your business',
  intro: 'Tell us a little about your business or project. No commitment, just a conversation. We usually reply within one business day.',
  body:
    'At OSKELO, we believe every business, and every person behind it, deserves to look as good as the work they actually do. Whether you want steady monthly content, a single promo video, event coverage or photography, the form below is the quickest way to get started. No commitment, just a conversation.',
};

export const FOUNDING_OFFER_DEFAULT = {
  eyebrow: 'Founding clients',
  heading: 'Start early, keep your rate',
  body:
    'We’re building our client list, and we want to reward the businesses that start with us.',
  conditions: [
    'Open to new clients starting a Starter, Growth or We Capture plan.',
    'Limited to our first five monthly clients.',
    'Your starting monthly rate stays the same for as long as your subscription stays active.',
    'If a subscription is canceled and later restarted, current pricing applies.',
  ],
  ctaLabel: 'Ask about founding pricing',
};

// Empty message hides the bar entirely.
export const PROMO_BAR_DEFAULT = {
  message: '',
};

export const FOOTER_DEFAULT = {
  copyright: '© 2026 OSKELO',
  location: 'Lancaster, PA',
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
