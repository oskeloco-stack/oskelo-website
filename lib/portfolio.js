// Flattens the work categories (lib/work.js, or the admin-edited copy) into
// one list of real projects for the Work page filters and homepage features.
// Nothing here invents work: every entry comes from an existing item.

export const WORK_FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'video', label: 'Video' },
  { key: 'photography', label: 'Photography' },
  { key: 'short-form', label: 'Short-Form' },
];

export function flattenWork(categories = []) {
  const out = [];
  for (const category of categories) {
    for (const item of category.items || []) {
      if (item.video) {
        // Vertical reels are short-form; mark a landscape piece with
        // `format: 'horizontal'` in lib/work.js to keep it out of that filter.
        const shortForm = item.format !== 'horizontal';
        out.push({
          kind: 'video',
          id: `${category.slug}-${item.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: item.name,
          tag: item.tag,
          group: item.group,
          description: item.description,
          video: item.video,
          image: item.image,
          duration: item.duration,
          vertical: shortForm,
          filters: ['video', ...(shortForm ? ['short-form'] : [])],
          service: shortForm ? 'Short-form video · filmed & edited' : 'Video production',
        });
      } else {
        const count = (item.gallery || []).length;
        out.push({
          kind: 'photo',
          id: `${category.slug}-${item.slug || item.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: item.name,
          tag: item.tag,
          group: item.group,
          image: item.image,
          href: item.slug ? `/work/${category.slug}/${item.slug}` : null,
          count,
          filters: ['photography'],
          focalX: item.focalX,
          focalY: item.focalY,
        });
      }
    }
  }
  return out;
}
