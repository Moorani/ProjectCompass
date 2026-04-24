import { useNavigate } from 'react-router-dom';
import './Footer.css';

const NAV_LINKS = [
  {
    heading: 'Explore',
    links: [
      { label: 'All Projects', path: '/explore' },
      { label: 'Categories', path: '/categories' },
      { label: 'Narrow My Project', path: '/narrow' },
    ],
  },
  {
    heading: 'Difficulty',
    links: [
      { label: 'Beginner Projects', path: '/explore' },
      { label: 'Intermediate Projects', path: '/explore' },
      { label: 'Advanced Projects', path: '/explore' },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-top-inner">

          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => navigate('/')}>
              ProjectCompass
            </div>
            <p className="footer-tagline">
              Helping CS students find, scope, and start their software projects
              with clarity and confidence.
            </p>
            <div className="footer-cta">
              <button
                className="footer-cta-btn"
                onClick={() => navigate('/narrow')}
              >
                Narrow My Project →
              </button>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="footer-nav-cols">
            {NAV_LINKS.map((col) => (
              <div className="footer-nav-col" key={col.heading}>
                <h4 className="footer-col-heading">{col.heading}</h4>
                <ul className="footer-link-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <span
                        className="footer-link"
                        onClick={() => navigate(link.path)}
                      >
                        {link.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Quick Start column */}
            <div className="footer-nav-col">
              <h4 className="footer-col-heading">Get Started</h4>
              <ul className="footer-link-list">
                <li>
                  <span className="footer-link" onClick={() => navigate('/explore')}>
                    Browse Projects
                  </span>
                </li>
                <li>
                  <span className="footer-link" onClick={() => navigate('/narrow')}>
                    Narrow My Project
                  </span>
                </li>
                <li>
                  <span className="footer-link" onClick={() => navigate('/categories')}>
                    View Categories
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} ProjectCompass. Built for CS students.
          </p>
          <div className="footer-bottom-badges">
            <span className="footer-badge badge-beginner">Beginner</span>
            <span className="footer-badge badge-intermediate">Intermediate</span>
            <span className="footer-badge badge-advanced">Advanced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}