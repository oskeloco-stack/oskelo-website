export default function FoundingOffer({ ctaHref = '/services/monthly-plans' }) {
  return (
    <section className="section promo" id="founding-offer">
      <div className="wrap">
        <div className="promo-inner">
          <div className="eyebrow">Monthly Rate Lock</div>
          <h2>The first 5 to sign up this month lock in their rate for good</h2>
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
