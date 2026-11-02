import { oneTimeOptions } from '../../lib/services';

// Every non-subscription option as a compact, linkable grid.
export default function OneTimeGrid({ services }) {
  const options = oneTimeOptions(services);
  if (options.length === 0) return null;

  return (
    <div className="onetime-row">
      {options.map((item) => (
        <a className="onetime" href={item.href} key={item.name}>
          <span className="onetime-name">{item.name}</span>
          <span className="onetime-price">{item.price}</span>
          <span className="onetime-detail">{item.detail}</span>
          <span className="onetime-arrow" aria-hidden="true">→</span>
        </a>
      ))}
    </div>
  );
}
