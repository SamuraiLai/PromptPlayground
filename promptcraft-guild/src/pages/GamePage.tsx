import { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import GateIntro from '../components/GateIntro';

const GamePage = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  
  // Check localStorage to see if the user has seen the intro before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('promptcraftGuild_hasSeenIntro');
    if (hasSeenIntro === 'true') {
      setSkipIntro(true);
    }
  }, []);
  
  const handleEnterGuild = () => {
    setHasEntered(true);
    // Save to localStorage that the user has seen the intro
    localStorage.setItem('promptcraftGuild_hasSeenIntro', 'true');
  };

  // If skipIntro is true, immediately show the GameBoard
  if (skipIntro) {
    return <GameBoard />;
  }

  return (
    <div className="App">
      {!hasEntered ? (
        <GateIntro onOpen={handleEnterGuild} />
      ) : (
        <GameBoard />
      )}
    </div>
  );
};

export default GamePage; 