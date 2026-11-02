import ReelVideo from './ReelVideo';

// Renders one portfolio category's items, grouped by each item's `group` in the
// category's preferred order (`category.groups`). A group only appears once it
// has work in it, and group headings only show when there's more than one.
// Videos (items with `video`) play inline; photo galleries link to their page.
export function groupItems(category) {
  const items = category.items || [];
  const order = category.groups || [];
  const names = [...new Set([...order, ...items.map((i) => i.group).filter(Boolean)])];
  return [
    ...names.map((name) => ({ name, items: items.filter((i) => i.group === name) })),
    { name: '', items: items.filter((i) => !i.group) },
  ].filter((g) => g.items.length > 0);
}

export default function WorkGroups({ category, headingLevel = 2, limit }) {
  let groups = groupItems(category);
  if (limit) {
    // Preview mode (the /work landing): first `limit` items overall, no headings.
    groups = [{ name: '', items: groups.flatMap((g) => g.items).slice(0, limit) }];
  }
  const Heading = `h${headingLevel}`;

  return groups.map((group) => {
    const videos = group.items.filter((item) => item.video);
    const galleries = group.items.filter((item) => !item.video);
    return (
      <div className="work-group" key={group.name || 'all'}>
        {group.name && groups.length > 1 && <Heading className="work-group-title">{group.name}</Heading>}
        {videos.length > 0 && (
          <div className="reels-grid">
            {videos.map((item) => (
              <figure className="reel-item" key={item.name}>
                <div className="reel-card has-video">
                  <ReelVideo src={item.video} poster={item.image} eyebrow={item.tag} title={item.name} duration={item.duration} />
                </div>
                {item.description && <figcaption>{item.description}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        {galleries.length > 0 && (
          <div className="work-grid">
            {galleries.map((item) => {
              const className = `work-card${item.image ? ' work-card--photo' : ''}`;
              const inner = (
                <>
                  {item.image && <img src={item.image} alt={`${item.name} — ${item.tag}`} loading="lazy" />}
                  <div className="tag">
                    <b>{item.name}</b>
                    <span>{item.tag}</span>
                  </div>
                </>
              );
              return item.slug ? (
                <a className={className} href={`/work/${category.slug}/${item.slug}`} key={item.name}>{inner}</a>
              ) : (
                <div className={className} key={item.name}>{inner}</div>
              );
            })}
          </div>
        )}
      </div>
    );
  });
}
