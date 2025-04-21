import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <div className="container">
          <nav>
            <img src="/scroll.svg" alt="Scroll" className="scroll-icon" style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
            <div className="logo">Prompt Playground</div>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/promptcraft-guild">Promptcraft Guild</Link>
              <a href="https://github.com/SamuraiLai/PromptPlayground" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Welcome to Prompt Playground</h1>
          <p className="subtitle">A collection of games to help you master the art of prompt engineering and AI interaction</p>
          <div>
            <Link to="/promptcraft-guild" className="cta-button">Try our Latest Game: Promptcraft Guild</Link>
            <a href="https://github.com/SamuraiLai/PromptPlayground" className="cta-button secondary" target="_blank" rel="noopener noreferrer">
              View and Contribute on GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="tools">
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Our Games</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-content">
                <h3 className="tool-title">Promptcraft Guild</h3>
                <p>Master prompt engineering through our constraint-based building game. Drag and drop cards from your collection to construct powerful prompts and get real-time feedback.</p>
                <Link to="/promptcraft-guild" className="cta-button" style={{ marginTop: '1rem' }}>Play Now</Link>
              </div>
            </div>
            
            <div className="tool-card">
              <div className="tool-content">
                <h3 className="tool-title">Coming Soon: CoT Landscaper</h3>
                <p>Promptcrafting using Chain of Thought (CoT) pruning to understand AI reasoning and control performance.</p>
                <Link to="#" className="cta-button secondary" style={{ marginTop: '1rem' }}>Join Waitlist</Link>
              </div>
            </div>
            
            <div className="tool-card">
              <div className="tool-content">
                <h3 className="tool-title">Coming Soon: Jargon Translator</h3>
                <p>Explain it to me like I'm a ... - <br/>
                  A tool which explains any concept in a way that any audience can understand.</p>
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