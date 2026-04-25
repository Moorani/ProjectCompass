import { useState } from 'react';
import './ProjectFormModal.css';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

function buildInitialForm(project, categories) {
  if (!project) {
    return {
      title: '',
      categoryId: categories[0]?.id ? String(categories[0].id) : '',
      difficulty: 'Beginner',
      effort: '',
      stack: '',
      description: '',
      problem: '',
      targetUsers: '',
      coreFeatures: '',
      notBuild: '',
      extensions: '',
    };
  }
  return {
    title: project.title || '',
    categoryId: String(project.categoryId || ''),
    difficulty: project.difficulty || 'Beginner',
    effort: project.effort || '',
    stack: (project.stack || []).join(', '),
    description: project.description || '',
    problem: project.problem || '',
    targetUsers: project.targetUsers || '',
    coreFeatures: (project.coreFeatures || []).join('\n'),
    notBuild: (project.notBuild || []).join('\n'),
    extensions: (project.extensions || []).join('\n'),
  };
}

/*
  Field is defined HERE, at module level, outside of ProjectFormModal.
  This is the fix. Defining it inside the component caused React to treat
  it as a new component type on every render, unmounting and remounting
  the input on every keystroke, which destroyed focus each time.
*/
function Field({ label, name, required, value, onChange, errors, type, placeholder }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}{required && <span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className={`form-textarea ${errors[name] ? 'error' : ''}`}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder || ''}
        />
      ) : (
        <input
          className={`form-input ${errors[name] ? 'error' : ''}`}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder || ''}
        />
      )}
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );
}

export default function ProjectFormModal({ project, categories, onSave, onClose }) {
  const [form, setForm] = useState(() => buildInitialForm(project, categories));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.categoryId) e.categoryId = 'Category is required';
    if (!form.effort.trim()) e.effort = 'Effort estimate is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.problem.trim()) e.problem = 'Problem statement is required';
    if (!form.targetUsers.trim()) e.targetUsers = 'Target users is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    await onSave({
      title: form.title.trim(),
      categoryId: parseInt(form.categoryId),
      difficulty: form.difficulty,
      effort: form.effort.trim(),
      description: form.description.trim(),
      problem: form.problem.trim(),
      targetUsers: form.targetUsers.trim(),
      stack: form.stack.split(',').map((s) => s.trim()).filter(Boolean),
      coreFeatures: form.coreFeatures.split('\n').map((s) => s.trim()).filter(Boolean),
      notBuild: form.notBuild.split('\n').map((s) => s.trim()).filter(Boolean),
      extensions: form.extensions.split('\n').map((s) => s.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="pf-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal">
        <div className="pf-header">
          <div>
            <h3>{project ? 'Edit Project' : 'Add New Project'}</h3>
            <p className="pf-header-sub">
              {project
                ? 'Update the project details below.'
                : 'Fill in the details to add a new project to the platform.'}
            </p>
          </div>
          <button className="pf-close" onClick={onClose} title="Close">&times;</button>
        </div>

        <form className="pf-body" onSubmit={handleSubmit}>

          <div className="pf-section">
            <div className="pf-section-title">Basic Information</div>

            <Field
              label="Project Title"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              errors={errors}
              placeholder="e.g. Student Budget Tracker"
            />

            <div className="pf-row-2">
              <div className="form-group">
                <label className="form-label">
                  Category<span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>
                </label>
                <select
                  className={`form-select ${errors.categoryId ? 'error' : ''}`}
                  value={form.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="form-error">{errors.categoryId}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  value={form.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pf-row-2">
              <Field
                label="Estimated Effort"
                name="effort"
                required
                value={form.effort}
                onChange={handleChange}
                errors={errors}
                placeholder="e.g. 3–4 weeks"
              />
              <Field
                label="Tech Stack (comma-separated)"
                name="stack"
                value={form.stack}
                onChange={handleChange}
                errors={errors}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
          </div>

          <div className="pf-section">
            <div className="pf-section-title">Project Details</div>

            <Field
              label="Short Description"
              name="description"
              required
              type="textarea"
              value={form.description}
              onChange={handleChange}
              errors={errors}
              placeholder="A one or two sentence overview of what this project does."
            />
            <Field
              label="Problem Statement"
              name="problem"
              required
              type="textarea"
              value={form.problem}
              onChange={handleChange}
              errors={errors}
              placeholder="What real problem does this project solve? Who experiences it?"
            />
            <Field
              label="Target Users"
              name="targetUsers"
              required
              value={form.targetUsers}
              onChange={handleChange}
              errors={errors}
              placeholder="e.g. University students managing a monthly allowance"
            />
          </div>

          <div className="pf-section">
            <div className="pf-section-title">Scope Definition</div>

            <Field
              label="Core Features (one per line)"
              name="coreFeatures"
              type="textarea"
              value={form.coreFeatures}
              onChange={handleChange}
              errors={errors}
              placeholder={'Add/edit/delete expense entries\nCategorise spending by type\nMonthly budget limits'}
            />
            <Field
              label="What NOT to Build (one per line)"
              name="notBuild"
              type="textarea"
              value={form.notBuild}
              onChange={handleChange}
              errors={errors}
              placeholder={'Bank account sync\nMulti-currency support'}
            />
            <Field
              label="Optional Extensions (one per line)"
              name="extensions"
              type="textarea"
              value={form.extensions}
              onChange={handleChange}
              errors={errors}
              placeholder={'Export data as CSV\nDark mode toggle'}
            />
          </div>

          <div className="pf-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : project ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}