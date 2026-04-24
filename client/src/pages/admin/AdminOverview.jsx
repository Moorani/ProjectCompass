import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getCategories } from '../../api/api';
import './AdminOverview.css';

export default function AdminOverview() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getCategories()])
      .then(([pRes, cRes]) => {
        setProjects(pRes.data.data || []);
        setCategories(cRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner"><div className="spinner" /></div>
    );
  }

  const beginner = projects.filter((p) => p.difficulty === 'Beginner').length;
  const intermediate = projects.filter((p) => p.difficulty === 'Intermediate').length;
  const advanced = projects.filter((p) => p.difficulty === 'Advanced').length;

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const diffClass = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
  };

  return (
    <div className="overview-root">
      <div className="overview-page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="overview-page-sub">
            A summary of all content in ProjectCompass.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/admin/projects')}
        >
          + Add Project
        </button>
      </div>

      <div className="overview-stats-grid">
        <div className="ov-stat-card ov-stat-accent">
          <div className="ov-stat-icon">&#9632;</div>
          <div className="ov-stat-value">{projects.length}</div>
          <div className="ov-stat-label">Total Projects</div>
        </div>
        <div className="ov-stat-card">
          <div className="ov-stat-icon">&#9632;</div>
          <div className="ov-stat-value">{categories.length}</div>
          <div className="ov-stat-label">Categories</div>
        </div>
        <div className="ov-stat-card">
          <div className="ov-stat-icon">&#9632;</div>
          <div className="ov-stat-value" style={{ color: 'var(--success)' }}>{beginner}</div>
          <div className="ov-stat-label">Beginner Projects</div>
        </div>
        <div className="ov-stat-card">
          <div className="ov-stat-icon">&#9632;</div>
          <div className="ov-stat-value" style={{ color: '#1b4f8a' }}>{intermediate}</div>
          <div className="ov-stat-label">Intermediate Projects</div>
        </div>
        <div className="ov-stat-card">
          <div className="ov-stat-icon">&#9632;</div>
          <div className="ov-stat-value" style={{ color: 'var(--error)' }}>{advanced}</div>
          <div className="ov-stat-label">Advanced Projects</div>
        </div>
      </div>

      <div className="overview-grid-2">
        <div className="ov-card">
          <div className="ov-card-header">
            <h2>Projects by Category</h2>
          </div>
          <div className="ov-card-body">
            {categories.length === 0 ? (
              <p className="ov-empty">No categories yet.</p>
            ) : (
              categories.map((cat) => {
                const count = projects.filter((p) => p.categoryId === cat.id).length;
                const pct = projects.length > 0
                  ? Math.round((count / projects.length) * 100)
                  : 0;
                return (
                  <div className="ov-bar-row" key={cat.id}>
                    <div className="ov-bar-label">{cat.name}</div>
                    <div className="ov-bar-track">
                      <div
                        className="ov-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="ov-bar-count">{count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="ov-card">
          <div className="ov-card-header">
            <h2>Difficulty Breakdown</h2>
          </div>
          <div className="ov-card-body">
            {[
              { label: 'Beginner', count: beginner, color: 'var(--success)', bg: 'var(--success-light)' },
              { label: 'Intermediate', count: intermediate, color: '#1b4f8a', bg: '#e6eef8' },
              { label: 'Advanced', count: advanced, color: 'var(--error)', bg: 'var(--error-light)' },
            ].map((d) => (
              <div className="ov-diff-row" key={d.label}>
                <div className="ov-diff-badge" style={{ background: d.bg, color: d.color }}>
                  {d.label}
                </div>
                <div className="ov-diff-bar-track">
                  <div
                    className="ov-diff-bar-fill"
                    style={{
                      width: projects.length > 0
                        ? `${Math.round((d.count / projects.length) * 100)}%`
                        : '0%',
                      background: d.color,
                    }}
                  />
                </div>
                <div className="ov-diff-count">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ov-card ov-recent-card">
        <div className="ov-card-header">
          <h2>Recently Added Projects</h2>
          <button
            className="ov-view-all"
            onClick={() => navigate('/admin/projects')}
          >
            View all &rarr;
          </button>
        </div>
        <div className="ov-card-body ov-card-body-flush">
          {recentProjects.length === 0 ? (
            <p className="ov-empty" style={{ padding: '1rem 1.25rem' }}>No projects yet.</p>
          ) : (
            <table className="ov-table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Effort</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td className="ov-td-title">{p.title}</td>
                    <td>{p.category?.name || '—'}</td>
                    <td>
                      <span className={`badge ${diffClass[p.difficulty] || 'badge-beginner'}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td>{p.effort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}