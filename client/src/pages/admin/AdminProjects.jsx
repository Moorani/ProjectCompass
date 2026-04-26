import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProjects,
  getCategories,
  createProject,
  updateProject,
  deleteProject,
} from '../../api/api';
import ProjectFormModal from './ProjectFormModal';
import './AdminTable.css';

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState({ visible: false, msg: '', type: 'success' });
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([getProjects(), getCategories()]);
      setProjects(pRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg, type = 'success') => {
    setToast({ visible: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleSave = useCallback(async (data) => {
    try {
      if (modal?.project) {
        await updateProject(modal.project.id, data);
        showToast('Project updated successfully');
      } else {
        await createProject(data);
        showToast('Project created successfully');
      }
      setModal(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Something went wrong', 'error');
    }
  }, [modal, fetchData]);

  const handleCloseModal = useCallback(() => {
    setModal(null);
  }, []);

  const handleDelete = (project) => {
    setDeleting(project);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProject(deleting.id);
      showToast(`"${deleting.title}" deleted`);
      setDeleting(null);
      fetchData();
    } catch {
      showToast('Delete failed', 'error');
      setDeleting(null);
    }
  };

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q);
    const matchDiff = !filterDiff || p.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  const diffClass = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
  };

  return (
    <div className="admin-page-root">
      {toast.visible && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>
      )}

      {modal && (
        <ProjectFormModal
          project={modal.project}
          categories={categories}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      {deleting && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Project</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>"{deleting.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ background: 'var(--error)' }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1>Manage Projects</h1>
          <p className="admin-page-sub">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ project: null })}>
          + Add Project
        </button>
      </div>

      <div className="admin-filter-bar">
        <input
          className="form-input admin-search"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select admin-filter-select"
          value={filterDiff}
          onChange={(e) => setFilterDiff(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        {(search || filterDiff) && (
          <button
            className="btn-ghost"
            onClick={() => { setSearch(''); setFilterDiff(''); }}
          >
            Clear
          </button>
        )}
        <span className="admin-filter-count">
          {filtered.length} of {projects.length} shown
        </span>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <p>
              {projects.length === 0
                ? 'No projects yet. Click "+ Add Project" to create one.'
                : 'No projects match your search.'}
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '32%' }}>Title</th>
                <th style={{ width: '18%' }}>Category</th>
                <th style={{ width: '13%' }}>Difficulty</th>
                <th style={{ width: '13%' }}>Effort</th>
                <th style={{ width: '24%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="td-title">{p.title}</div>
                    <div className="td-desc">
                      {p.description?.slice(0, 60)}...
                    </div>
                  </td>
                  <td>
                    <span className="td-category">
                      {p.category?.name || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${diffClass[p.difficulty] || 'badge-beginner'}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="td-muted">{p.effort}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="tbl-btn tbl-view"
                        onClick={() => navigate(`/project/${p.id}`)}
                        title="View on site"
                      >
                        View
                      </button>
                      <button
                        className="tbl-btn tbl-edit"
                        onClick={() => setModal({ project: p })}
                      >
                        Edit
                      </button>
                      <button
                        className="tbl-btn tbl-delete"
                        onClick={() => handleDelete(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}