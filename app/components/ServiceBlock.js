import { TRAVEL_NOTE } from '../../lib/services';

const FOOTAGE_LABEL = { client: 'You send footage', onsite: 'We film on-site' };

// Inquiry link with the matching form option preselected (see Contact.js).
function inquiryHref(interest) {
  return `/contact?interest=${encodeURIComponent(interest)}#contact`;
}

const INTEREST_BY_PLAN = {
  Edit: 'Video editing (my footage)',
  'Capture + Short': 'One short-form video',
  'Signature Video': 'Promotional video / brand film',
};
const INTEREST_BY_SERVICE = {
  'one-time-shoot': 'Event videography',
  photography: 'Photography',
};

export default function ServiceBlock({ service, eyebrow = 'One-time project', headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <>
      <div className="section-head">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <Heading>{service.title}</Heading>
        </div>
        <p>{service.subtitle}</p>
      </div>

      {service.type === 'plans' ? (
        <>
          <div className="packages">
            {service.plans.map((pkg) => (
              <div className={`package ${pkg.featured ? 'featured' : ''}`} key={pkg.name}>
                <div className="package-top">
                  <h3>{pkg.name}</h3>
                  {pkg.footage && <span className={`plan-footage is-${pkg.footage}`}>{FOOTAGE_LABEL[pkg.footage]}</span>}
                </div>
                <div className="price">{pkg.price}</div>
                {pkg.bestFor && <p className="plan-bestfor">{pkg.bestFor}</p>}
                <ul>
                  {pkg.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a className="btn btn-outline btn-sm" href={inquiryHref(INTEREST_BY_PLAN[pkg.name] || 'Something else')}>
                  Book this
                </a>
              </div>
            ))}
          </div>
          {service.plans.some((p) => p.travel) && <p className="plan-note">{TRAVEL_NOTE}</p>}
        </>
      ) : (
        <div className="service-detail">
          <div className="price">{service.price}</div>
          <ul>
            {service.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          {service.travel && <p className="travel-note">{TRAVEL_NOTE}</p>}
          <a className="btn btn-solid" href={inquiryHref(INTEREST_BY_SERVICE[service.slug] || 'Something else')}>
            {service.cta ? 'Get a quote' : 'Get started'}
          </a>
        </div>
      )}
    </>
  );
}
