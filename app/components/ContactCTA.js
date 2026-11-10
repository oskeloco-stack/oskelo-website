import { Arrow, contactHref } from './ui';

// The dark, photographic closing section used at the end of every page.
// The default photo is OSKELO's own concert photography (not stock).
// `interest` preselects an option on the contact form.
export default function ContactCTA({
  heading = 'Good work deserves to be seen.',
  body = 'Let’s create content that tells your story, connects with your audience and shows the work you actually do.',
  interest,
  image = '/work/concerts/guitarist-raised.jpg',
  imageAlt = '',
  credit = 'Concert photography by OSKELO',
  cta = 'Start a Project',
}) {
  return (
    <section className={`s-cta${image ? '' : ' s-cta--plain'}`} aria-labelledby="s-cta-heading">
      {image && (
        <div className="s-cta-media">
          <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="s-wrap">
        <div className="s-cta-inner">
          <h2 className="s-h2" id="s-cta-heading">{heading}</h2>
          <p className="s-lead">{body}</p>
          <div className="s-cta-row">
            <a className="s-btn s-btn--light" href={contactHref(interest)}>{cta} <Arrow /></a>
            <a className="s-cta-mail" href="mailto:contact@oskelo.com">contact@oskelo.com</a>
          </div>
        </div>
      </div>
      {image && credit && <span className="s-cta-credit">{credit}</span>}
    </section>
  );
}
