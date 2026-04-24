import { useState, useEffect } from 'react';
import { getProjects, getCategories } from '../api/api';
import ProjectCard from '../components/ProjectCard';
import './ExplorePage.css';

export default function ExplorePage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStack, setFilterStack] = useState('');

  useEffect(() => {
    Promise.all([getProjects(), getCategories()])
      .then(([pRes, cRes]) => {
        setProjects(pRes.data.data);
        setCategories(cRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const allStacks = [...new Set(projects.flatMap((p) => p.stack || []))].sort();

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.stack || []).some((s) => s.toLowerCase().includes(q));
    const matchDiff = !filterDiff || p.difficulty === filterDiff;
    const matchCat = !filterCat || p.categoryId === parseInt(filterCat);
    const matchStack = !filterStack || (p.stack || []).includes(filterStack);
    return matchSearch && matchDiff && matchCat && matchStack;
  });

  return (
    <div className="page-wrapper">
      <div className="explore-hero">
        <div className="container">
          <span className="explore-eyebrow">Discover</span>
          <h1>Explore All Projects</h1>
          <p className="explore-subtitle">
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
          <div className="explore-filter-box">
            <div className="explore-filter-group">
              <span className="explore-filter-label">Difficulty</span>
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
            <div className="explore-filter-group">
              <span className="explore-filter-label">Category</span>
              <select
                className="catdetail-select"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="explore-filter-group">
              <span className="explore-filter-label">Tech Stack</span>
              <select
                className="catdetail-select"
                value={filterStack}
                onChange={(e) => setFilterStack(e.target.value)}
              >
                <option value="">All Technologies</option>
                {allStacks.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container explore-body">
        <div className="explore-results-count">
          {loading ? 'Loading...' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
        </div>

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
            <p>No projects match your filters.</p>
            <span>Try clearing a filter or adjusting your search.</span>
          </div>
        ) : (
          <div className="explore-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}