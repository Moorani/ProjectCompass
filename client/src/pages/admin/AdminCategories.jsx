import { useState, useEffect, useCallback } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/api';
import './AdminTable.css';

const emptyForm = { name: '', icon: '', description: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '', type: 'success' });
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (msg, type = 'success') => {
    setToast({ visible: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const openAdd = () => {
    setEditing('new');
    setForm(emptyForm);
    setFormError('');
  };

  const openEdit = (cat) => {
    setEditing(cat.id);
    setForm({
      name: cat.name || '',
      icon: cat.icon || '',
      description: cat.description || '',
    });
    setFormError('');
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    setSaving(true);
    try {
      if (editing === 'new') {
        await createCategory(form);
        showToast('Category created successfully');
      } else {
        await updateCategory(editing, form);
        showToast('Category updated successfully');
      }
      closeForm();
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat) => setDeleting(cat);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteCategory(deleting.id);
      showToast(`"${deleting.name}" deleted`);
      setDeleting(null);
      fetchData();
    } catch {
      showToast(
        'Cannot delete — this category has projects assigned to it. Reassign or delete those projects first.',
        'error'
      );
      setDeleting(null);
    }
  };

  return (
    <div className="admin-page-root">
      {toast.visible && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>
      )}

      {deleting && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Category</h3>
            <p>
              Are you sure you want to delete <strong>"{deleting.name}"</strong>?
              You must reassign or delete all projects in this category first.
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
          <h1>Manage Categories</h1>
          <p className="admin-page-sub">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} total
          </p>
        </div>
        {editing === null && (
          <button className="btn-primary" onClick={openAdd}>+ Add Category</button>
        )}
      </div>

      {editing !== null && (
        <div className="inline-form-card">
          <div className="inline-form-header">
            <h2>{editing === 'new' ? 'New Category' : 'Edit Category'}</h2>
            <button className="modal-close-btn" onClick={closeForm}>&times;</button>
          </div>

          {formError && <div className="alert alert-error">{formError}</div>}

          <div className="inline-form-grid">
            <div className="form-group">
              <label className="form-label">Name <span style={{ color: 'var(--error)' }}>*</span></label>
              <input
                className={`form-input ${formError && !form.name ? 'error' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Web Applications"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Icon identifier</label>
              <input
                className="form-input"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. web, mobile, ai"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short description of what this category covers..."
              rows={3}
            />
          </div>

          <div className="inline-form-actions">
            <button className="btn-secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing === 'new' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-card">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : categories.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <p>No categories yet. Click "+ Add Category" to create one.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Name</th>
                <th style={{ width: '10%' }}>Icon</th>
                <th style={{ width: '38%' }}>Description</th>
                <th style={{ width: '10%' }}>Projects</th>
                <th style={{ width: '20%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="td-title">{c.name}</td>
                  <td className="td-muted">{c.icon || '—'}</td>
                  <td className="td-desc-cell">
                    {c.description || <span style={{ color: 'var(--dust-grey)' }}>No description</span>}
                  </td>
                  <td>
                    <span className="project-count-badge">
                      {(c.projects || []).length}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="tbl-btn tbl-edit"
                        onClick={() => openEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="tbl-btn tbl-delete"
                        onClick={() => handleDelete(c)}
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