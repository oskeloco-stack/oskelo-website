export const WORK_CATEGORIES = [
  {
    slug: 'photography',
    title: 'Photography',
    subtitle: 'Product, listing, and event photography for growing businesses.',
    cover: '/work/covers/photography.jpg',
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
        ],
      },
      { name: 'Harlow & Co.', tag: 'Product photography' },
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

export function getWorkCategory(slug) {
  return WORK_CATEGORIES.find((category) => category.slug === slug);
}

export function getWorkProject(categorySlug, projectSlug) {
  const category = getWorkCategory(categorySlug);
  if (!category) return null;
  const project = category.items.find((item) => item.slug === projectSlug);
  if (!project) return null;
  return { category, project };
}
