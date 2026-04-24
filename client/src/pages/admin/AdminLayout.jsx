import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo">PC</div>
          <div>
            <div className="admin-brand-name">ProjectCompass</div>
            <div className="admin-brand-role">Admin Panel</div>
          </div>
        </div>

        <div className="admin-user-chip">
          <div className="admin-user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="admin-user-info">
            <div className="admin-user-label">Signed in as</div>
            <div className="admin-user-email">{user?.email}</div>
          </div>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-section-label">Navigation</div>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            <span className="admin-nav-icon">&#9632;</span>
            Overview
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            <span className="admin-nav-icon">&#9632;</span>
            Projects
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            <span className="admin-nav-icon">&#9632;</span>
            Categories
          </NavLink>
        </div>

        <div className="admin-nav-section" style={{ marginTop: 'auto' }}>
          <div className="admin-nav-section-label">Actions</div>
          <button className="admin-nav-link admin-nav-btn-link" onClick={() => navigate('/')}>
            <span className="admin-nav-icon">&#8592;</span>
            View Site
          </button>
          <button className="admin-nav-link admin-nav-btn-link admin-logout-link" onClick={handleLogout}>
            <span className="admin-nav-icon">&#10006;</span>
            Log Out
          </button>
        </div>
      </aside>

      <div className="admin-content-area">
        <Outlet />
      </div>
    </div>
  );
}