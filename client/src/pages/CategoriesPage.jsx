import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getProjects } from '../api/api';
import './CategoriesPage.css';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getCategories(), getProjects()])
      .then(([catRes, projRes]) => {
        setCategories(catRes.data.data);
        setProjects(projRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getCount = (catId) => projects.filter((p) => p.categoryId === catId).length;

  const filtered = categories.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="cat-page-hero">
        <div className="container">
          <div className="cat-hero-content">
            <span className="cat-hero-eyebrow">Explore</span>
            <h1>Project Categories</h1>
            <p className="cat-page-subtitle">
              Browse project ideas organised by category. Each category contains
              curated projects with detailed scope and difficulty information.
            </p>
            <div className="cat-search-row">
              <div className="cat-search-wrapper">
                <span className="cat-search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  className="cat-search-input"
                  placeholder="Search by keywords, titles, or tech..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="cat-search-btn">Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container cat-body">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p>No categories match your search.</p>
            <span>Try different keywords or clear your search.</span>
          </div>
        ) : (
          <>
            <div className="cat-results-meta">
              <span>{filtered.length} {filtered.length === 1 ? 'category' : 'categories'} found</span>
            </div>
            <div className="cat-grid">
              {filtered.map((cat) => {
                const count = getCount(cat.id);
                return (
                  <div
                    key={cat.id}
                    className="cat-card"
                    onClick={() => navigate(`/categories/${cat.id}`)}
                  >
                    <div className="cat-card-top">
                      <h3 className="cat-card-name">{cat.name}</h3>
                      <p className="cat-card-desc">{cat.description}</p>
                    </div>
                    <div className="cat-card-footer">
                      <span className="cat-card-count">
                        {count} {count === 1 ? 'project' : 'projects'}
                      </span>
                      <span className="cat-card-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}