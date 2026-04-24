import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const diffClass = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
  }[project.difficulty] || 'badge-beginner';

  return (
    <div className="project-card" onClick={() => navigate(`/project/${project.id}`)}>
      <div className="project-card-top">
        <h3 className="project-card-title">{project.title}</h3>
        <span className={`badge ${diffClass}`}>{project.difficulty}</span>
      </div>
      <p className="project-card-desc">{project.description}</p>
      <div className="project-card-footer">
        <div className="tags-row">
          {(project.stack || []).slice(0, 3).map((s) => (
            <span className="tag" key={s}>{s}</span>
          ))}
        </div>
        <div className="project-card-effort">
          <span className="effort-icon">&#9201;</span>
          {project.effort}
        </div>
      </div>
    </div>
  );
}