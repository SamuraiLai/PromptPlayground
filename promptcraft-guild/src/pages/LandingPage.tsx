import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <div className="container">
          <nav>
            <div className="logo">Prompt Playground</div>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/promptcraft-guild">Promptcraft Guild</Link>
              <a href="https://github.com/promptplayground/promptcraft-guild" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Welcome to Prompt Playground</h1>
          <p className="subtitle">A collection of tools to help you master the art of prompt engineering and AI interaction</p>
          <div>
            <Link to="/promptcraft-guild" className="cta-button">Try Promptcraft Guild</Link>
            <a href="https://github.com/promptplayground/promptcraft-guild" className="cta-button secondary" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="tools">
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Our Tools</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-content">
                <h3 className="tool-title">Promptcraft Guild</h3>
                <p>Learn the art of prompt engineering through an interactive game. Build your prompts using cards and get instant feedback.</p>
                <Link to="/promptcraft-guild" className="cta-button" style={{ marginTop: '1rem' }}>Play Now</Link>
              </div>
            </div>
            
            <div className="tool-card">
              <div className="tool-content">
                <h3 className="tool-title">Coming Soon: Prompt Workshop</h3>
                <p>Advanced prompt crafting environment with templates, versioning, and performance analytics.</p>
                <Link to="#" className="cta-button secondary" style={{ marginTop: '1rem' }}>Join Waitlist</Link>
              </div>
            </div>
            
            <div className="tool-card">
              <div className="tool-content">
                <h3 className="tool-title">Coming Soon: Prompt Library</h3>
                <p>A curated collection of high-performance prompts for various use cases and AI models.</p>
                <Link to="#" className="cta-button secondary" style={{ marginTop: '1rem' }}>Join Waitlist</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Prompt Playground. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 