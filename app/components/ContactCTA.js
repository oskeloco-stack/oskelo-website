// A short closing call to action for secondary pages (Work, galleries, About).
// The full inquiry form lives on the homepage and /contact; `interest`
// preselects an option there, the same way the plan buttons do.
export default function ContactCTA({
  heading = 'Like what you see?',
  body = 'Tell us about your business and we’ll put together the right plan or project. We usually reply within one business day.',
  interest,
}) {
  const href = interest ? `/contact?interest=${encodeURIComponent(interest)}#contact` : '/contact';
  return (
    <section className="cta-band" aria-labelledby="cta-band-heading">
      <div className="wrap cta-band-inner">
        <div>
          <h2 id="cta-band-heading">{heading}</h2>
          <p>{body}</p>
        </div>
        <div className="cta-band-actions">
          <a className="btn btn-solid" href={href}>Start your inquiry</a>
          <a className="cta-band-email" href="mailto:contact@oskelo.com">contact@oskelo.com</a>
        </div>
      </div>
    </section>
  );
}
