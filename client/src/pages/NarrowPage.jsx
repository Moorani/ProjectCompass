import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/api';
import ProjectCard from '../components/ProjectCard';
import './NarrowPage.css';

const STEPS = [
  {
    key: 'skill',
    question: "What is your skill level?",
    sub: "Be honest — this helps us filter out projects that might frustrate you.",
    options: [
      { value: 'Beginner', label: 'Beginner', sub: "I'm learning the basics. Built a few small programs or followed tutorials." },
      { value: 'Intermediate', label: 'Intermediate', sub: 'I can build small apps independently. Comfortable with at least one framework.' },
      { value: 'Advanced', label: 'Advanced', sub: "I've built multiple projects. I understand architecture, APIs, and databases." },
    ],
  },
  {
    key: 'interest',
    question: 'What area interests you most?',
    sub: "Choose the category you'd like to explore, or keep it open.",
    options: [
      { value: 'Web Applications', label: 'Web Applications', sub: 'Browser-based applications using modern web technologies. Great for learning frontend and full-stack development.' },
      { value: 'Mobile Applications', label: 'Mobile Applications', sub: 'Apps for iOS and Android using native or cross-platform frameworks. Good for learning mobile-specific UX patterns.' },
      { value: 'AI / ML Projects', label: 'AI / ML', sub: 'Projects involving data analysis, machine learning models, and intelligent automation. Requires some math background.' },
      { value: 'Systems & Tools', label: 'Systems & Tools', sub: 'Command-line tools, developer utilities, and system-level software. Builds strong fundamentals in CS concepts.' },
      { value: 'Data-Driven Projects', label: 'Data-Driven Projects', sub: 'Visualization dashboards, analytics tools, and data processing pipelines. Learn to work with real-world datasets.' },
      { value: 'Social Impact Projects', label: 'Social Impact Projects', sub: 'Software that addresses community needs such as volunteering, accessibility, and resource allocation.' },
    ],
  },
  {
    key: 'time',
    question: 'How much time do you have?',
    sub: 'Estimate the total time you can dedicate to this project.',
    options: [
      { value: '1-2weeks', label: '1–2 weeks', sub: 'Quick project — great for learning one specific thing.' },
      { value: '2-4weeks', label: '2–4 weeks', sub: 'Medium scope — enough for a solid mini-project.' },
      { value: '1-2months', label: '1–2 months', sub: 'Good scope — room for multiple features.' },
      { value: '2-3months', label: '2–3 months', sub: 'Full semester project — build something substantial.' },
    ],
  },
  {
    key: 'team',
    question: 'Solo or team project?',
    sub: 'Working alone and in a team require different project choices.',
    options: [
      { value: 'solo', label: 'Solo', sub: "I'm working on this by myself." },
      { value: 'team', label: 'Team', sub: 'I have teammates (2–4 people).' },
      { value: 'either', label: 'Either works', sub: "I'm flexible about team size." },
    ],
  },
  {
    key: 'goal',
    question: "What's your primary goal?",
    sub: 'This helps us prioritize the right type of project for you.',
    options: [
      { value: 'learning', label: 'Learning', sub: 'I want to learn new technologies and concepts.' },
      { value: 'portfolio', label: 'Portfolio', sub: 'I want something impressive to show employers.' },
      { value: 'both', label: 'Both', sub: 'I want to learn AND build something I can showcase.' },
    ],
  },
];

function effortToWeeks(effort) {
  if (!effort) return 4;
  const lower = effort.toLowerCase();
  if (lower.includes('month')) {
    const match = lower.match(/(\d+)/);
    return match ? parseInt(match[1]) * 4 : 8;
  }
  const match = lower.match(/(\d+)/);
  return match ? parseInt(match[1]) : 4;
}

function matchScore(project, answers, categoryName) {
  const skillMap = {
    Beginner: ['Beginner'],
    Intermediate: ['Beginner', 'Intermediate'],
    Advanced: ['Beginner', 'Intermediate', 'Advanced'],
  };

  if (!skillMap[answers.skill]?.includes(project.difficulty)) return -1;

  const weeks = effortToWeeks(project.effort);
  const timeMap = {
    '1-2weeks': 2,
    '2-4weeks': 4,
    '1-2months': 8,
    '2-3months': 12,
  };
  const maxWeeks = timeMap[answers.time] || 4;
  if (weeks > maxWeeks + 2) return -1;

  let score = 0;
  if (categoryName === answers.interest) score += 3;
  if (project.difficulty === answers.skill) score += 2;
  if (weeks <= maxWeeks) score += 1;

  return score;
}

function getWarnings(answers, projects) {
  const warnings = [];
  if (projects.length > 0) {
    const weeks = effortToWeeks(projects[0].effort);
    if ((answers.time === '1-2weeks' || answers.time === '2-4weeks') && weeks >= 6)
      warnings.push('Some matched projects may be larger than your available time. Plan your scope carefully.');
    if (answers.team === 'solo' && weeks >= 7)
      warnings.push('These projects are large for a solo developer. Consider scoping down your features.');
  }
  return warnings;
}

export default function NarrowPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const selected = answers[current?.key];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (!selected) return;
    if (isLast) {
      await computeResults(answers);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const selectOption = (value) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  };

  const computeResults = async (finalAnswers) => {
    setLoading(true);
    try {
      const res = await getProjects();
      const allProjects = res.data.data;
      const scored = allProjects
        .map((p) => ({
          p,
          score: matchScore(p, finalAnswers, p.category?.name || ''),
        }))
        .filter((x) => x.score >= 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p);
      setWarnings(getWarnings(finalAnswers, scored));
      setResults(scored);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
    setWarnings([]);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="narrow-hero">
          <div className="container narrow-hero-inner">
            <span className="narrow-eyebrow">Guided Quiz</span>
            <h1>Narrow My Project</h1>
            <p>Finding your matches...</p>
          </div>
        </div>
        <div className="loading-spinner"><div className="spinner" /></div>
      </div>
    );
  }

  if (results !== null) {
    return (
      <div className="page-wrapper">
        <div className="narrow-hero">
          <div className="container narrow-hero-inner">
            <span className="narrow-eyebrow">Your Results</span>
            <h1>Narrow My Project</h1>
            <p>Based on your skill level, interests, and timeline.</p>
            <p className="results-hero-count">
              <strong>{results.length} projects matched for you</strong>
            </p>
          </div>
        </div>

        <div className="container narrow-results-body">
          <div className="results-top-row">
            <div>
              <h2 className="results-heading">Recommended Projects</h2>
              <p className="results-subheading">
                {results.length} {results.length === 1 ? 'project' : 'projects'} matched — higher scores appear first.
              </p>
            </div>
            <button className="start-over-btn" onClick={reset}>
              ↩ Start Over
            </button>
          </div>

          {warnings.map((w, i) => (
            <div className="alert alert-warning" key={i}>
              <span className="alert-icon">⚠</span>
              {w}
            </div>
          ))}

          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p>No projects matched your combination.</p>
              <span>Try starting over with different answers.</span>
            </div>
          ) : (
            <div className="results-grid">
              {results.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="narrow-hero">
        <div className="container narrow-hero-inner">
          <span className="narrow-eyebrow">Guided Quiz</span>
          <h1>Narrow My Project</h1>
          <p>Answer a few questions and we'll filter projects that match your needs.</p>
        </div>
      </div>

      <div className="container narrow-body">
        <div className="narrow-progress-wrap">
          <div className="narrow-progress-bar">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`narrow-progress-seg ${i <= step ? 'filled' : ''}`}
              />
            ))}
          </div>
          <span className="narrow-progress-label">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        <h2 className="narrow-question">{current.question}</h2>
        <p className="narrow-sub">{current.sub}</p>

        <div className="narrow-options">
          {current.options.map((opt) => (
            <div
              key={opt.value}
              className={`narrow-option-card ${selected === opt.value ? 'selected' : ''}`}
              onClick={() => selectOption(opt.value)}
            >
              <div className="narrow-radio">
                <div className={`radio-outer ${selected === opt.value ? 'checked' : ''}`}>
                  {selected === opt.value && <div className="radio-inner" />}
                </div>
              </div>
              <div className="narrow-option-text">
                <div className="narrow-option-label">{opt.label}</div>
                <div className="narrow-option-sub">{opt.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={`narrow-nav ${step === 0 ? 'nav-end' : 'nav-between'}`}>
          {step > 0 && (
            <button className="narrow-nav-btn" onClick={handleBack}>
              &larr; Back
            </button>
          )}
          <button
            className={`narrow-nav-btn primary ${!selected ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!selected}
          >
            {isLast ? 'Show Results' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}