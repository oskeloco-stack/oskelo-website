import { SERVICES } from '../../lib/services';

export default function Header() {
  return (
    <header>
      <div className="nav">
        <a className="logo" href="/#top">
          <img className="logo-img" src="/4.png" alt="Oskelo" />
        </a>
        <nav className="nav-links">
          <a href="/#work">Work</a>
          <div className="nav-dropdown">
            <a href="/#services" className="nav-dropdown-trigger">Services</a>
            <div className="nav-dropdown-menu">
              {SERVICES.map((service) => (
                <a href={`/services/${service.slug}`} key={service.slug}>
                  <b>{service.title}</b>
                  <span>{service.subtitle}</span>
                </a>
              ))}
            </div>
          </div>
          <a href="/about">Team</a>
          <a href="/#contact">Contact</a>
        </nav>
        <a className="btn btn-solid btn-sm" href="/#contact">Get a quote</a>
      </div>
    </header>
  );
}
