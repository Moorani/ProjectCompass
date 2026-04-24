import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={close}>
          Project<span>Compass</span>
        </Link>

        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'} onClick={close}>Home</Link>
          <Link to="/categories" className={isActive('/categories') ? 'nav-link active' : 'nav-link'} onClick={close}>Categories</Link>
          <Link to="/explore" className={isActive('/explore') ? 'nav-link active' : 'nav-link'} onClick={close}>Explore</Link>
          <Link to="/narrow" className={isActive('/narrow') ? 'nav-link active' : 'nav-link'} onClick={close}>Narrow My Project</Link>

          {user ? (
            <>
              <Link
                to="/admin"
                className={location.pathname.startsWith('/admin') ? 'nav-link active' : 'nav-link'}
                onClick={close}
              >
                Dashboard
              </Link>
              <button className="navbar-logout" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="navbar-cta" onClick={close}>Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}