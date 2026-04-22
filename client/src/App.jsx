import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header Section */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span className="badge badge-beginner">Project Active</span>
          <h1 style={{ fontSize: '3rem', marginTop: '1rem' }}>Project Compass</h1>
          <p style={{ color: 'var(--charcoal-brown)', maxWidth: '600px', margin: '1rem auto' }}>
            Building a personal finance tool for students to log expenses, 
            set budgets, and view spending patterns.
          </p>
        </header>

        {/* Main Content Card */}
        <main style={{ 
          background: 'white', 
          padding: '2.5rem', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Development Console</h2>
          
          <div className="alert alert-success">
            Frontend is successfully connected to <strong>index.css</strong>
          </div>

          <div className="form-group">
            <label className="form-label">Quick Action</label>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Test your React state by incrementing the counter:
            </p>
            <button className="btn-primary" onClick={() => setCount(count + 1)}>
              Count is: {count}
            </button>
          </div>

          <hr className="divider" />

          <div className="tags-row">
            <span className="tag">React v18</span>
            <span className="tag">Vite</span>
            <span className="tag">JWT Auth</span>
          </div>
        </main>

        {/* Footer / Empty State Style */}
        <footer className="empty-state">
          <p>Ready to start building your dashboard?</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn-secondary">View Docs</button>
            <button className="btn-ghost">Need Help?</button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App