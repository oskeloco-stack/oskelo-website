import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Terms & Conditions — Oskelo',
  description: 'Terms and conditions for OSKELO video creation services.',
};

export default function Terms() {
  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section legal">
            <div className="section-head">
              <div>
                <div className="eyebrow">Legal</div>
                <h2>Terms & Conditions</h2>
                <div className="legal-updated">Last Updated: September 5, 2026</div>
              </div>
              <p>Questions about anything below? Reach us at the email at the bottom of this page.</p>
            </div>

            <h3>Our Services</h3>
            <p>
              OSKELO provides video creation services for businesses,
              including monthly short-form video plans, one-time on-site
              shoots, and one-time edited videos. The scope, deliverables,
              and pricing for each service are described on our Services
              pages and confirmed with you before work begins.
            </p>

            <h3>Scheduling & Rescheduling</h3>
            <p>
              On-location shoots must be scheduled in advance. If you need
              to reschedule, please give us as much notice as possible —
              ideally at least 24–48 hours. Because shoots often involve
              reserved time, travel, and sometimes outside contractors,
              OSKELO may charge a rescheduling or cancellation fee when
              significant time, travel, or other resources have already
              been committed to your shoot. Any such fee will be
              communicated to you before it applies.
            </p>

            <h3>Weather & On-Site Conditions</h3>
            <p>
              Some shoots depend on conditions outside our control. OSKELO
              may reschedule or adjust an on-location shoot due to weather,
              unsafe conditions, property access issues, or other
              circumstances that would affect safety or the quality of the
              final production. Rescheduling for these reasons isn't a
              failure to perform the service, and we'll work with you to
              find a new time as soon as reasonably possible.
            </p>

            <h3>Travel & On-Location Fees</h3>
            <p>
              On-location pricing generally includes reasonable travel
              within approximately 15 miles of OSKELO's normal service
              area. This distance is a guideline, not a guarantee — being
              within 15 miles doesn't automatically mean no additional
              charges will apply. Additional fees may apply based on
              distance, travel time, parking, tolls, accessibility,
              unusual location requirements, or other project-specific
              circumstances. Any additional charges will always be
              disclosed and approved before your project is confirmed.
            </p>

            <h3>Turnaround Times</h3>
            <p>
              We may provide an estimated turnaround time for your
              project, but unless a specific delivery date has been agreed
              to in writing, these are estimates rather than guarantees.
              OSKELO makes reasonable efforts to meet the timelines we
              communicate to you.
            </p>

            <h3>Client Delays</h3>
            <p>
              Production and delivery timelines depend in part on you. If
              OSKELO is waiting on footage, information, site access,
              approvals, revision feedback, or other materials from you,
              your project's timeline may be extended accordingly.
            </p>

            <h3>Payment & Billing</h3>
            <p>
              Monthly plans are billed on a recurring monthly basis
              starting on the date your subscription begins. One-time
              projects require payment in full, or an agreed deposit,
              before work begins unless otherwise arranged in writing.
              Prices listed on our site are starting prices for standard
              scopes — final pricing for any project is confirmed with you
              in advance.
            </p>

            <h3>Payment Protection</h3>
            <p>
              If an invoice or required payment becomes overdue, OSKELO
              may pause production, withhold final deliverables, or
              suspend recurring services until the outstanding balance is
              paid. Work resumes once payment is received.
            </p>

            <h3>Cancellation</h3>
            <p>
              You may cancel a monthly plan at any time; cancellation
              takes effect at the end of your current billing period, and
              no partial refunds are issued for time already billed.
              Founding member pricing applies only for as long as a
              subscription remains active without lapsing — if a
              subscription is canceled and later restarted, current
              pricing will apply.
            </p>

            <h3>Revisions</h3>
            <p>
              Each package includes a set number of revision rounds,
              listed on the relevant Services page, covering reasonable
              changes within the originally agreed project scope. Major
              creative changes, additional deliverables, reshoots, or
              requests that materially change the original project may be
              treated as additional work and quoted separately.
            </p>

            <h3>Raw Footage</h3>
            <p>
              Raw, unedited footage isn't automatically included with a
              finished-video package unless the package specifically says
              so, or OSKELO and you agree to it separately. Raw footage
              may be made available for an additional fee.
            </p>

            <h3>Client-Provided Footage</h3>
            <p>
              For services using footage you provide, you confirm that you
              own or have the rights to use that footage, and any music,
              images, or other content you supply. You agree to hold
              OSKELO harmless from any claims arising from content you
              provide.
            </p>

            <h3>Ownership & Usage Rights</h3>
            <p>
              Once a project is paid in full, you may use your final
              delivered content for your intended business, personal, and
              social-media purposes. Third-party materials used in your
              project — such as licensed music, fonts, stock footage,
              graphics, or other assets — remain subject to their own
              licenses and aren't transferred to you or OSKELO as owned
              intellectual property. OSKELO retains the right to display
              completed work in our portfolio, website, social media,
              advertising, and other promotional materials, unless you
              request otherwise in writing.
            </p>

            <h3>Music & Third-Party Licensing</h3>
            <p>
              OSKELO may use properly licensed music, stock footage,
              fonts, graphics, or other third-party materials in your
              project. These materials remain governed by their own
              licenses. Please don't extract, redistribute, resell, or use
              these third-party assets separately from your delivered work
              unless you independently hold the appropriate rights to do
              so.
            </p>

            <h3>No Performance Guarantee</h3>
            <p>
              OSKELO provides content creation and production services. We
              do not guarantee specific business or social-media results,
              including but not limited to views, followers, engagement,
              leads, customers, sales, revenue, conversions, virality, or
              platform reach. How content performs after delivery depends
              on many factors outside our control.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              OSKELO will make every reasonable effort to deliver quality
              work on schedule. To the extent permitted by law, OSKELO's
              liability for any claim related to our services is limited
              to the amount you paid for the project in question.
            </p>

            <h3>Changes to These Terms</h3>
            <p>
              We may update these Terms & Conditions from time to time.
              Updated terms apply to future purchases, renewals, or
              services entered into after the update takes effect, and
              don't change the terms of a project you've already agreed to
              with us, unless we separately agree otherwise with you.
            </p>

            <h3>Contact</h3>
            <p>
              Questions about these terms can be sent to{' '}
              <a href="mailto:oskelo.co@gmail.com">oskelo.co@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
