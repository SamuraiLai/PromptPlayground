import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Sparkles, Coins } from 'lucide-react';
import PlayCard from './PlayCard';
import CardSlot from './CardSlot';
import Timer from './Timer';
import FeedbackDisplay from './FeedbackDisplay';
import { useGameState } from '../hooks/useGameState';
import { SlotState } from '../types';

const GameBoard: React.FC = () => {
  const {
    state,
    dealCards,
    dragCard,
    updatePrompt,
    submitPrompt,
    nextRound
  } = useGameState();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Initial deal
  useEffect(() => {
    dealCards();
  }, [dealCards]);
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const cardData = active.data.current?.card;
    if (!cardData) return;
    
    // Determine destination type from the droppable id
    let destinationType: keyof SlotState | 'hand';
    
    if (over.id === 'hand-tray') {
      destinationType = 'hand';
    } else if (typeof over.id === 'string' && over.id.startsWith('slot-')) {
      // Extract the slot type from the id (e.g., 'slot-mentor' -> 'mentor')
      const slotType = over.id.replace('slot-', '');
      // Validate that slotType is a valid key for SlotState
      if (slotType === 'mentor' || slotType === 'method' || slotType === 'modifier') {
        destinationType = slotType;
      } else {
        return; // Invalid slot type, ignore the drop
      }
    } else {
      return;
    }
    
    // Dispatch drag card action
    dragCard(cardData, destinationType);
  };
  
  // Determine game phase display
  const renderGamePhase = () => {
    switch (state.phase) {
      case 'deal':
        return (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center p-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-2xl border border-amber-500/30 max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="text-2xl font-serif mb-3 text-amber-100">Welcome to the Promptcraft Guild</h2>
            <p className="text-amber-200 mb-4">Drag a card from your hand to begin your challenge.</p>
            <motion.div 
              className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "#b45309" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {}}
            >
              Begin
            </motion.div>
          </motion.div>
        );
        
      case 'compose':
        return (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Timer timeRemaining={state.timeRemaining} isActive={state.isTimerActive} />
          </div>
        );
        
      case 'score':
        return (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center p-6 bg-black/70 backdrop-blur-md rounded-xl shadow-2xl border border-amber-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-center mb-3">
              <Sparkles className="text-amber-400" size={32} />
            </div>
            <p className="text-xl text-amber-100 font-serif">Evaluating your prompt...</p>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  const ChipStack = () => {
    const level = state.level;
    
    return (
      <motion.div 
        className="absolute top-4 right-6 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <div className="relative mr-3">
          {[...Array(Math.min(level, 5))].map((_, i) => (
            <motion.div 
              key={i}
              className={`absolute w-12 h-12 rounded-full border-2 border-amber-900 shadow-lg ${
                i % 3 === 0 ? 'bg-amber-300' : 
                i % 3 === 1 ? 'bg-indigo-300' : 'bg-emerald-300'
              }`}
              initial={{ y: 0 }}
              animate={{ y: i * -4 }}
              style={{ zIndex: 5 - i }}
            />
          ))}
          <motion.div 
            className="w-12 h-12 rounded-full bg-amber-400 border-2 border-amber-900 shadow-lg flex items-center justify-center z-10 relative"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          >
            <Coins className="w-6 h-6 text-amber-900" />
          </motion.div>
        </div>
        <div className="text-right">
          <div className="text-amber-300 font-serif font-bold text-lg">Level {level}</div>
          <div className="text-amber-200 text-sm">Streak: {state.streak}/2</div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen relative overflow-hidden bg-green-900 bg-opacity-95 flex flex-col">
        {/* Felt texture overlay */}
        <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <header className="relative z-10 py-4 px-6 shadow-lg bg-gradient-to-b from-green-950 to-green-900 border-b border-amber-900/20">
          <div className="container mx-auto flex items-center">
            <div className="flex items-center">
              <Scroll className="text-amber-300 mr-2" size={28} />
              <h1 className="text-3xl font-serif font-bold text-amber-100">Promptcraft Guild</h1>
            </div>
          </div>
        </header>
        
        <main className="flex-grow relative flex flex-col items-center justify-between py-8 px-4">
          {/* Top area with ChipStack */}
          <ChipStack />
          
          {/* Center area - Card Slots */}
          <motion.div 
            className="mb-8 mt-16 w-full max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-3 gap-6 mb-6">
              <CardSlot type="mentor" card={state.slots.mentor} label="Mentor" glow="indigo" />
              <CardSlot type="method" card={state.slots.method} label="Method" glow="emerald" />
              <CardSlot type="modifier" card={state.slots.modifier} label="Modifier" glow="amber" />
            </div>
            
            {/* Token bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-amber-200 font-medium">Tokens Used</div>
                <div className="text-sm font-mono font-bold text-amber-200">{state.tokenCount}/{state.tokenLimit}</div>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden bg-green-950/50 border border-green-800 backdrop-blur-sm">
                <motion.div 
                  className={`h-full rounded-full ${
                    state.tokenCount > state.tokenLimit ? 'bg-gradient-to-r from-red-600 to-red-400' :
                    state.tokenCount > state.tokenLimit * 0.7 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 
                    'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${Math.min(100, (state.tokenCount / state.tokenLimit) * 100)}%`,
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>
            
            {/* Prompt Text Area */}
            <div className="relative">
              <textarea
                value={state.promptText}
                onChange={(e) => updatePrompt(e.target.value)}
                placeholder="Type your prompt here..."
                className="w-full p-4 min-h-32 bg-black/30 border border-amber-900/30 rounded-lg text-amber-100 placeholder-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-serif backdrop-blur-sm shadow-inner"
                disabled={state.phase === 'score'}
              />
              
              <motion.button
                type="button"
                onClick={submitPrompt}
                disabled={!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score'}
                className={`absolute bottom-4 right-4 px-6 py-2 rounded-md font-serif text-lg shadow-lg ${
                  (!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score')
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                    : 'bg-amber-600 text-white hover:bg-amber-500'
                }`}
                whileHover={!(!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score') ? { scale: 1.05, backgroundColor: "#d97706" } : {}}
                whileTap={!(!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score') ? { scale: 0.98 } : {}}
              >
                {state.phase === 'score' ? (
                  <>
                    <span className="mr-2">Evaluating</span>
                    <span className="animate-pulse">...</span>
                  </>
                ) : (
                  'Cast Prompt'
                )}
              </motion.button>
            </div>
          </motion.div>
          
          {/* Hand tray at bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <motion.div 
              className="bg-gradient-to-t from-green-950 to-green-900/90 shadow-[0_-4px_6px_rgba(0,0,0,0.3)] border-t border-amber-900/30 pt-3 pb-6 px-6"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-2">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-900/30 text-amber-200 text-sm font-medium">Your Hand</span>
              </div>
              <div className="flex justify-center overflow-x-auto gap-3 pb-2 hand-cards" style={{ perspective: "1000px" }}>
                <AnimatePresence>
                  {state.hand.length === 0 ? (
                    <div className="text-amber-400/60 italic flex items-center h-40 justify-center font-serif">
                      No cards in hand
                    </div>
                  ) : (
                    state.hand.map((card, index) => (
                      <motion.div 
                        key={card.id}
                        layout
                        initial={{ opacity: 0, rotateX: -30, y: 50 }}
                        animate={{ 
                          opacity: 1, 
                          rotateX: 0, 
                          y: 0,
                          rotate: index % 2 === 0 ? -2 : 2,
                          x: (index - (state.hand.length - 1) / 2) * 10
                        }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ 
                          delay: index * 0.1, 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 30 
                        }}
                        className="origin-bottom"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <PlayCard 
                          card={card} 
                          isDragging={activeId === card.id}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          
          {/* Game phase overlay */}
          {renderGamePhase()}
        </main>
        
        <FeedbackDisplay
          result={state.result}
          feedback={state.feedback}
          suggestions={state.suggestions}
          onContinue={nextRound}
        />
      </div>
    </DndContext>
  );
};

export default GameBoard; 