export default function FoundingOffer({ ctaHref = '/services/monthly-plans' }) {
  return (
    <section className="section promo" id="founding-offer">
      <div className="wrap promo-inner">
        <div className="eyebrow">Founding Member Offer</div>
        <h2>The first 5 lock in their rate for good</h2>
        <p>
          Start any monthly plan as one of our first 5 clients and your
          price is grandfathered in for as long as you stay subscribed —
          even after our rates go up. Join early, and what you pay today
          is what you could pay forever.
        </p>
        <a className="btn btn-solid" href={ctaHref}>Claim your spot</a>
      </div>
    </section>
  );
}
