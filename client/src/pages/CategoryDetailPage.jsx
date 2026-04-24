import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategory } from '../api/api';
import ProjectCard from '../components/ProjectCard';
import './CategoryDetailPage.css';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');

  useEffect(() => {
    getCategory(id)
      .then((res) => setCategory(res.data.data))
      .catch(() => navigate('/categories'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-spinner"><div className="spinner" /></div>
    </div>
  );

  if (!category) return null;

  const filtered = (category.projects || []).filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.stack || []).some((s) => s.toLowerCase().includes(q));
    const matchDiff = !filterDiff || p.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  return (
    <div className="page-wrapper">
      <div className="catdetail-hero">
        <div className="container">
          <button className="btn-ghost catdetail-back" onClick={() => navigate('/categories')}>
            &larr; All Categories
          </button>
          <h1>{category.name}</h1>
          <p className="catdetail-subtitle">{category.description}</p>
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

      <div className="container catdetail-body">
        <div className="catdetail-filter-bar">
          <div className="catdetail-filter-group">
            <label className="filter-group-label">Difficulty</label>
            <select
              className="catdetail-select"
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="catdetail-count">
          Showing {filtered.length} of {category.projects?.length || 0} projects
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p>No projects match your filters.</p>
            <span>Try clearing the search or difficulty filter.</span>
          </div>
        ) : (
          <div className="catdetail-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}