export default function FoundingOffer({ ctaHref = '/services/monthly-plans', image }) {
  return (
    <section className={`section promo${image ? ' promo--image' : ''}`} id="founding-offer">
      {image && (
        <div className="promo-bg" aria-hidden="true">
          <img src={image} alt="" loading="lazy" />
        </div>
      )}
      <div className="wrap">
        <div className="promo-inner">
          <div className="eyebrow">Monthly Rate Lock</div>
          <h2>Lock in your rate for good</h2>
          <p>
            Start any monthly plan this month and, if you're one of the first
            5 to sign up, today's rate is grandfathered in for as long as you
            stay subscribed — even after our prices go up. What you pay now is
            what you pay for good.
          </p>
          <a className="btn btn-solid" href={ctaHref}>Claim your spot</a>
        </div>
      </div>
    </section>
  );
}
