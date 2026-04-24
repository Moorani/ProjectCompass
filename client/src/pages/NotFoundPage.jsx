import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', color: 'var(--spicy-paprika)' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page not found</h2>
        <p style={{ color: 'var(--charcoal-brown)', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Go home</button>
      </div>
    </div>
  );
}