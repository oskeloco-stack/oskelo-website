import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import ReelVideo from '../components/ReelVideo';
import { SERVICES, getService } from '../../lib/services';
import { WORK_CATEGORIES } from '../../lib/work';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Videography & Video Editing in Lancaster, PA',
  description:
    'Short-form and promo videos for Lancaster, PA small businesses. We film at your business or edit the clips you send. Monthly plans, one-time videos and event videography.',
  alternates: { canonical: '/video' },
};

const fromPrice = (price) => price?.replace(/^Starting at /, '');

export default async function VideoPage() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  const monthly = getService('monthly-plans', services);
  const oneTime = getService('one-time-video', services);
  const events = getService('one-time-shoot', services);
  const reels = (categories.find((cat) => cat.slug === 'video-editing')?.items || []).filter((item) => item.video);

  // Three plain choices. Prices come from the same data as the service pages.
  const options = [
    {
      title: 'Monthly video plans',
      body: 'Fresh short-form videos every month for Instagram, TikTok, Facebook and YouTube. Send us clips, or we come film.',
      price: monthly?.plans?.[0]?.price && <>From <b>{fromPrice(monthly.plans[0].price)}</b></>,
      href: '/services/monthly-plans',
      cta: 'See monthly plans',
      featured: true,
    },
    {
      title: 'One-time video',
      body: 'A single polished video, from a quick edit of your own footage to a full promo or brand film.',
      price: oneTime?.plans?.[0]?.price && <>From <b>{fromPrice(oneTime.plans[0].price)}</b></>,
      href: '/services/one-time-video',
      cta: 'See one-time videos',
    },
    {
      title: 'Events & custom projects',
      body: 'Event videography and bigger productions, planned around exactly what you need.',
      price: events?.price,
      href: '/services/one-time-shoot',
      cta: 'Learn more',
    },
  ];

  return (
    <>
      <Header />
      <main id="main" className="home">
        <section className="home-hero home-hero--page">
          <div className="wrap">
            <div className="home-hero-copy page-hero-copy">
              <div className="home-pill">Videography &amp; editing</div>
              <h1>Videos that show people what you do.</h1>
              <p className="home-lede">
                We come to your business and film, or you send us the clips from your phone. Either way, you get
                polished videos that are ready to post.
              </p>
              <div className="home-ctas">
                <a className="btn btn-solid" href="/contact?interest=One-time%20video#contact">Talk to us about video</a>
                <a className="btn btn-outline" href="#options">See options &amp; prices</a>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section home-section--first" id="options">
          <div className="wrap">
            <div className="home-head">
              <div className="home-eyebrow">Pick what fits</div>
              <h2>Three simple ways to work with us</h2>
            </div>
            <div className="video-options">
              {options.map((o) => (
                <a className={`video-option${o.featured ? ' is-featured' : ''}`} href={o.href} key={o.title}>
                  {o.featured && <span className="video-option-tag">Most popular</span>}
                  <h3>{o.title}</h3>
                  <p>{o.body}</p>
                  <div className="home-offer-foot">
                    {o.price && <span className="home-price">{o.price}</span>}
                    <span className="home-link">{o.cta} <span aria-hidden="true">→</span></span>
                  </div>
                </a>
              ))}
            </div>
            <div className="video-callout">
              <div>
                <h3>Already filming on your phone?</h3>
                <p>Send us the raw clips and we’ll handle the rest: the cut, captions, music and colour.</p>
              </div>
              <a className="btn btn-outline" href="/contact?interest=Video%20editing%20(my%20footage)#contact">Get it edited</a>
            </div>
          </div>
        </section>

        {reels.length > 0 && (
          <section className="home-section home-section--tint">
            <div className="wrap">
              <div className="home-head home-head--row">
                <div>
                  <div className="home-eyebrow">Recent videos</div>
                  <h2>Filmed and edited by us</h2>
                </div>
                <a className="home-link" href="/work/video-editing">All video work <span aria-hidden="true">→</span></a>
              </div>
              <div className="reels-row home-reels">
                {reels.slice(0, 4).map((reel) => (
                  <figure className="reel-item" key={reel.name}>
                    <div className="reel-card has-video">
                      <ReelVideo src={reel.video} poster={reel.image} eyebrow={reel.tag} title={reel.name} duration={reel.duration} description={reel.description} />
                    </div>
                    {reel.description && <figcaption>{reel.description}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="home-contact">
          <Contact heading="Let’s talk about your video" intro="Tell us a little about your business and what you have in mind. We usually reply within one business day." />
        </div>
      </main>
      <Footer />
    </>
  );
}
