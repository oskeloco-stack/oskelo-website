import Header from '../components/Header';
import Footer from '../components/Footer';

const TEAM = [
  {
    name: 'David Becker',
    role: 'Owner and Founder',
    bio: 'Leads every shoot and signs off on the final cut of each project.',
  },
  {
    name: 'Charity Reist',
    role: 'Photographer',
    bio: 'Captures the stills that bring each brand story to life.',
  },
  {
    name: 'David Oconnel',
    role: 'Videographer and Editor',
    bio: 'Films on-site and edits raw footage into the final cut.',
  },
];

export const metadata = {
  title: 'About the Team — Oskelo',
  description: 'Meet the people behind Oskelo — video and photo for businesses, individuals, and events.',
};

export default function About() {
  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="about">
            <div className="section-head">
              <div>
                <div className="eyebrow">About</div>
                <h2>Focused on your<br />business's growth</h2>
              </div>
              <p>A small, dedicated crew committed to helping your business stand out — from first call to final cut.</p>
            </div>

            <div className="team-grid">
              {TEAM.map((member) => (
                <div className="team-card" key={member.name}>
                  <div className="team-avatar"></div>
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p>{member.bio}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
