import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import './pages/LandingPage.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/promptcraft-guild" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
