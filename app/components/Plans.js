import { TRAVEL_NOTE } from '../../lib/services';

const FOOTAGE_LABEL = { client: 'You send footage', onsite: 'We film on-site' };

const COMPARE_ROWS = [
  { key: 'videos', label: 'Short-form videos / month' },
  { key: 'footage', label: 'Footage' },
  { key: 'shoot', label: 'Monthly on-site shoot (60–90 min)' },
  { key: 'captions', label: 'Editing, hooks & captions' },
  { key: 'direction', label: 'Content ideas & direction' },
  { key: 'photos', label: 'Photography from the shoot' },
];

function Cell({ value }) {
  if (value === true) return <span className="cmp-yes" aria-label="Included">✓</span>;
  if (value === false) return <span className="cmp-no" aria-label="Not included">—</span>;
  return <>{value}</>;
}

// Monthly plan cards, with an optional comparison table underneath.
// `service` is the monthly-plans entry from the (admin-editable) services list.
export default function Plans({ service, compare = true, travel = 'full', ctaHref = '/contact' }) {
  if (!service?.plans) return null;
  const plans = service.plans;
  const showCompare = compare && plans.every((p) => p.specs);

  return (
    <>
      <div className="plan-grid">
        {plans.map((plan) => (
          <article className={`plan${plan.featured ? ' is-featured' : ''}`} key={plan.name}>
            {plan.featured && <span className="plan-badge">Most popular</span>}
            <header className="plan-head">
              <h3>{plan.name}</h3>
              {plan.footage && (
                <span className={`plan-footage is-${plan.footage}`}>{FOOTAGE_LABEL[plan.footage]}</span>
              )}
            </header>
            <div className="plan-price">{plan.price}</div>
            {plan.bestFor && <p className="plan-bestfor">{plan.bestFor}</p>}
            <ul className="plan-features">
              {plan.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <a
              className={`btn ${plan.featured ? 'btn-solid' : 'btn-outline'}`}
              href={`${ctaHref}?interest=${encodeURIComponent(`Monthly plan: ${plan.name}`)}#contact`}
            >
              Get started with {plan.name}
            </a>
          </article>
        ))}
      </div>

      {showCompare && (
        <div className="cmp-wrap" id="compare">
          <table className="cmp">
            <caption className="sr-only">Monthly plan comparison</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Feature</span></th>
                {plans.map((p) => (
                  <th scope="col" key={p.name} className={p.featured ? 'is-featured' : undefined}>
                    {p.name}<span>{p.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{row.label}</th>
                  {plans.map((p) => (
                    <td key={p.name} className={p.featured ? 'is-featured' : undefined}>
                      <Cell value={p.specs[row.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {plans.some((p) => p.travel) && (travel === 'short' ? (
        <p className="plan-note">
          On-site plans include travel within about 15 miles. <a href="/services/monthly-plans#details">Travel details</a>
        </p>
      ) : (
        <p className="plan-note">{TRAVEL_NOTE}</p>
      ))}
    </>
  );
}
