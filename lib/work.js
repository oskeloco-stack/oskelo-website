export const WORK_CATEGORIES = [
  {
    slug: 'photography',
    title: 'Photography',
    subtitle: 'Product, listing, and event photography for growing businesses.',
    cover: '/work/covers/photography.jpg',
    images: [
      '/work/portraits/woodland-path-smile.jpg',
    ],
    items: [
      {
        name: 'Portraits',
        tag: 'Senior and individual portrait photography',
        image: '/work/portraits/field-dress.jpg',
        slug: 'portraits',
        gallery: [
          { src: '/work/portraits/field-dress.jpg', alt: 'Portrait of a woman in a blue floral dress in a golden field at sunset' },
          { src: '/work/portraits/autumn-blanket.jpg', alt: 'Senior portrait of a person seated on a blanket among autumn leaves' },
          { src: '/work/portraits/woodland-suit.jpg', alt: 'Senior portrait of a young man in a navy suit crouched on a woodland path' },
          { src: '/work/portraits/shoot-1.jpg', alt: 'Portrait of a woman in a white dress and red headwrap leaning against a palm tree on a sandy beach' },
          { src: '/work/portraits/shoot-2.jpg', alt: 'Senior portrait of a woman in a green dress beside a garden pond with a fountain behind her' },
          { src: '/work/portraits/shoot-3.jpg', alt: 'Portrait of a man in a tan leather jacket seated among the branches of a large tree' },
          { src: '/work/portraits/shoot-4.jpg', alt: 'Portrait of a man in a tan leather jacket crouched on a wooded path, smiling' },
          { src: '/work/portraits/shoot-5.jpg', alt: 'Close portrait of a man in a tan leather jacket resting against a moss-streaked rock' },
          { src: '/work/portraits/formal-couple-steps.jpg', alt: 'Formal portrait of a couple on a flower-lined staircase' },
          { src: '/work/portraits/formal-couple-kiss.jpg', alt: 'Couple sharing a kiss on a flower-lined staircase' },
          { src: '/work/portraits/warm-light-portrait.jpg', alt: 'Portrait of a woman lit by warm evening light against greenery' },
        ],
      },
      {
        name: 'Concerts',
        tag: 'Live music and event photography',
        image: '/work/concerts/stage-vocalist.jpg',
        slug: 'concerts',
        gallery: [
          { src: '/work/concerts/stage-vocalist.jpg', alt: 'Vocalist singing into a handheld mic under blue stage light' },
          { src: '/work/concerts/guitarist-raised.jpg', alt: 'Guitarist mid-song with both arms raised over his head against a blue backdrop' },
          { src: '/work/concerts/duo-guitars.jpg', alt: 'Two guitarists leaning together and laughing on stage, in black and white' },
          { src: '/work/concerts/crowd-phones.jpg', alt: 'Crowd near the barricade with hands and phones in the air during a set' },
          { src: '/work/concerts/green-light-vocalist.jpg', alt: 'Vocalist singing under green stage light, microphone in hand' },
          { src: '/work/concerts/guitarist-bw.jpg', alt: 'Guitarist mid-riff under a single spotlight, in black and white' },
          { src: '/work/concerts/rapper-spotlight.jpg', alt: 'Performer rapping into the mic under a bright spotlight' },
          { src: '/work/concerts/singer-crouch.jpg', alt: 'Singer crouched at the edge of the stage mid-performance' },
        ],
      },
      {
        name: 'Sports',
        tag: 'Game-day and team photography',
        image: '/work/sports/field-hockey.jpg',
        slug: 'sports',
        gallery: [
          { src: '/work/sports/field-hockey.jpg', alt: 'Field hockey player carrying the ball upfield in afternoon light' },
          { src: '/work/sports/night-stiff-arm.jpg', alt: 'Running back delivering a stiff-arm under the lights, in black and white' },
          { src: '/work/sports/cutback-run.jpg', alt: 'Ball carrier cutting back upfield past a defender during a night game' },
          { src: '/work/sports/line-of-scrimmage.jpg', alt: 'Two lines set across the line of scrimmage just before the snap' },
          { src: '/work/sports/flag-football.jpg', alt: 'Flag football players chasing down the ball carrier under stadium lights' },
          { src: '/work/sports/golf-tee-marker.jpg', alt: 'Golfer crouched to set the tee marker on the green' },
          { src: '/work/sports/basketball-drive.jpg', alt: 'Basketball guard driving the ball upcourt past a defender' },
          { src: '/work/sports/sprint-start.jpg', alt: 'Sprinter exploding out of the starting blocks on the track' },
          { src: '/work/sports/relay-handoff.jpg', alt: 'Runner sprinting with the relay baton in hand' },
          { src: '/work/sports/freestyle-lap.jpg', alt: 'Swimmer mid-stroke during a freestyle lap' },
          { src: '/work/sports/sideline-cheer.jpg', alt: 'Three cheerleaders posing on the sideline in team colors' },
        ],
      },
      {
        name: 'Wedding & Engagement',
        tag: 'Ceremony and portrait photography',
        image: '/work/marrow-studio.jpg',
        slug: 'wedding-engagement',
        // Add photos here as { src: '/work/wedding-engagement/xyz.jpg', alt: '...' }
        gallery: [
          { src: '/work/wedding-engagement/veil-barn.jpg', alt: 'Bride and groom embracing beneath a veil in front of a red barn' },
          { src: '/work/wedding-engagement/field-bouquet.jpg', alt: 'Bride holding a white and blue bouquet with the groom in a sunlit field' },
          { src: '/work/wedding-engagement/brick-courtyard-kiss.jpg', alt: 'Couple sharing a kiss in a brick courtyard, engagement ring in view' },
          { src: '/work/wedding-engagement/carriage-house-dance.jpg', alt: 'Couple dancing as the groom twirls the bride outside a carriage house' },
          { src: '/work/wedding-engagement/garden-path.jpg', alt: 'Couple walking hand in hand down a tree-lined garden path' },
          { src: '/work/wedding-engagement/holding-hands.jpg', alt: 'Close-up of the couple holding hands, engagement ring in focus' },
          { src: '/work/wedding-engagement/cheek-embrace.jpg', alt: 'Bride and groom nose to nose, foreheads together in the sun' },
          { src: '/work/wedding-engagement/floral-field-walk.jpg', alt: 'Bride in a blue floral dress walking through a windswept summer field' },
          { src: '/work/wedding-engagement/lawn-portrait.jpg', alt: 'Groom and bride standing close on a sunlit lawn, veil catching the breeze' },
        ],
      },
    ],
  },
  {
    slug: 'video-editing',
    title: 'Video & Editing',
    subtitle: 'Brand films, social content, and edited video for growing businesses.',
    cover: '/work/covers/video-editing.jpg',
    items: [
      { name: 'Foundry Coffee', tag: 'Brand film' },
      { name: 'Vantage Fitness', tag: 'Social campaign' },
      { name: 'Fielding Law', tag: 'Testimonial' },
    ],
  },
];

// `categories` lets a page pass in the admin-edited content (from getContent);
// it defaults to the built-in WORK_CATEGORIES so existing callers keep working.
export function getWorkCategory(slug, categories = WORK_CATEGORIES) {
  return categories.find((category) => category.slug === slug);
}

export function getWorkProject(categorySlug, projectSlug, categories = WORK_CATEGORIES) {
  const category = getWorkCategory(categorySlug, categories);
  if (!category) return null;
  const project = (category.items || []).find((item) => item.slug === projectSlug);
  if (!project) return null;
  return { category, project };
}
