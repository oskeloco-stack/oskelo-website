import Contact from './Contact';
import { Eyebrow } from './ui';

// The inquiry form with a heading, for pages other than /contact.
export default function ContactSection({
  heading = 'Start a project',
  intro = 'Tell us about your business or project. We usually reply within one business day.',
}) {
  return (
    <section className="s-section s-section--alt" id="contact" style={{ scrollMarginTop: 80 }} aria-labelledby="contact-heading">
      <div className="s-wrap s-contact">
        <div className="s-contact-aside">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="s-h2" id="contact-heading">{heading}</h2>
          <p className="s-lead">{intro}</p>
          <a className="s-contact-mail" href="mailto:contact@oskelo.com">contact@oskelo.com</a>
          <p className="s-contact-place">Based in Lancaster, Pennsylvania.</p>
        </div>
        <Contact />
      </div>
    </section>
  );
}
