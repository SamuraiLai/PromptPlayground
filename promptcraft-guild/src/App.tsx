import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GameBoard from './components/GameBoard';
import LandingPage from './pages/LandingPage';
import './pages/LandingPage.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/promptcraft-guild" element={<div className="App"><GameBoard /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
