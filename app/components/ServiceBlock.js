import { TRAVEL_NOTE } from '../../lib/services';

export default function ServiceBlock({ service, contactHref = '#contact' }) {
  return (
    <>
      <div className="section-head">
        <div>
          <div className="eyebrow">Services</div>
          <h2>{service.title}</h2>
        </div>
        <p>{service.subtitle}</p>
      </div>

      {service.type === 'plans' ? (
        <div className="packages">
          {service.plans.map((pkg) => (
            <div className={`package ${pkg.featured ? 'featured' : ''}`} key={pkg.name}>
              <h3>{pkg.name}</h3>
              <div className="price">{pkg.price}</div>
              <ul>
                {pkg.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              {pkg.travel && <p className="travel-note">{TRAVEL_NOTE}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="service-detail">
          <div className="price">{service.price}</div>
          <ul>
            {service.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          {service.travel && <p className="travel-note">{TRAVEL_NOTE}</p>}
          <a className="btn btn-solid" href={contactHref}>
            {service.cta ? 'Get a quote' : 'Get started'}
          </a>
        </div>
      )}
    </>
  );
}
