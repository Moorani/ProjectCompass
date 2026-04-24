import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../api/api';
import './ProjectDetailPage.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject(id)
      .then((res) => setProject(res.data.data))
      .catch(() => navigate('/explore'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-spinner"><div className="spinner" /></div>
    </div>
  );

  if (!project) return null;

  const diffClass = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
  }[project.difficulty] || 'badge-beginner';

  return (
    <div className="page-wrapper">
      <div className="detail-hero">
        <div className="container">
          <div className="detail-breadcrumb">
            <span className="bc-link" onClick={() => navigate('/categories')}>Categories</span>
            <span className="bc-sep">›</span>
            {project.category && (
              <>
                <span
                  className="bc-link"
                  onClick={() => navigate(`/categories/${project.categoryId}`)}
                >
                  {project.category.name}
                </span>
                <span className="bc-sep">›</span>
              </>
            )}
            <span className="bc-current">{project.title}</span>
          </div>

          <h1 className="detail-hero-title">{project.title}</h1>

          <div className="detail-hero-meta">
            <span className="meta-chip">
              <span className="meta-chip-icon">⏱</span>
              {project.effort}
            </span>
            <span className="meta-chip">
              <span className="meta-chip-icon">👤</span>
              Solo
            </span>
            <span className={`meta-chip meta-diff ${diffClass}`}>
              {project.difficulty}
            </span>
          </div>

          <div className="detail-hero-stack">
            <div className="stack-label">Suggested Tech Stack</div>
            <div className="tags-row">
              {(project.stack || []).map((s) => (
                <span className="detail-stack-tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-content">
          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-icon">💡</span>
              <h2>Problem Statement</h2>
            </div>
            <p>{project.problem}</p>
          </div>

          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-icon">🎯</span>
              <h2>Target Users</h2>
            </div>
            <p>{project.targetUsers}</p>
          </div>

          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-icon">✅</span>
              <h2>Core Features</h2>
            </div>
            <p className="section-intro">
              These are the minimum features you should build. This is your MVP.
            </p>
            <ul className="detail-list">
              {(project.coreFeatures || []).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-icon">🚫</span>
              <h2>What NOT to Build</h2>
            </div>
            <p className="section-intro">
              These are explicitly out of scope. Don't fall into the trap of over-engineering.
            </p>
            <ul className="detail-list detail-list-not">
              {(project.notBuild || []).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-icon">🚀</span>
              <h2>Optional Extensions</h2>
            </div>
            <p className="section-intro">
              Only attempt these after completing all core features. These are stretch goals.
            </p>
            <ul className="detail-list detail-list-ext">
              {(project.extensions || []).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div className="detail-narrow-cta" onClick={() => navigate('/narrow')}>
            <div className="detail-narrow-cta-inner">
              <div className="detail-narrow-cta-text">
                <p className="detail-narrow-cta-label">Not sure this is right for you?</p>
                <h3>Try Narrow My Project</h3>
              </div>
              <span className="detail-narrow-cta-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}