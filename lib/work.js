export const WORK_CATEGORIES = [
  {
    slug: 'photography',
    title: 'Photography',
    subtitle: 'Product, listing, and event photography for growing businesses.',
    items: [
      { name: 'Northside Realty', tag: 'Listing photography' },
      { name: 'Harlow & Co.', tag: 'Product photography' },
      { name: 'Marrow Studio', tag: 'Event photography' },
    ],
  },
  {
    slug: 'video-editing',
    title: 'Video & Editing',
    subtitle: 'Brand films, social content, and edited video for growing businesses.',
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
