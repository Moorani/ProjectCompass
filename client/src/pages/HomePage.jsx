import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const steps = [
  { n: '1', title: 'Pick your context', desc: 'Tell us your skill level, time availability, and team size.' },
  { n: '2', title: 'Browse filtered ideas', desc: 'We surface the most suitable ideas from our curated library.' },
  { n: '3', title: 'Read the full brief', desc: 'Each project includes scope, minimum features, and things to avoid.' },
  { n: '4', title: 'Start with clarity', desc: 'Begin knowing what you are building, who it is for, and what success looks like.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">For CS Students</div>
          <h1 className="hero-title">
            Stop staring at a blank page. 
            <em> Find your project.</em>
          </h1>
          <p className="hero-subtitle">
            ProjectCompass helps you explore curated software project ideas and narrow
            them down based on your skill level, timeline, and goals - no guesswork,
            no overwhelm.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/explore')}>
              Explore Projets
            </button>
            <button className="btn-secondary" onClick={() => navigate('/narrow')}>
              Narrow My Project &rarr;
            </button>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="how-section-header">
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">From idea to brief in minutes</h2>
            <p className="section-subtitle">
              A simple four-step process to get you building with confidence.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step-card" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-eyebrow">Guided Quiz</div>
            <h2>Not sure where to start?</h2>
            <p>Answer five quick questions and we will match you with the most suitable project ideas.</p>
            <button className="btn-primary cta-btn" onClick={() => navigate('/narrow')}>
              Take the guided quiz &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}