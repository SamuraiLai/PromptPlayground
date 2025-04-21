import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Scroll, Sparkles } from 'lucide-react';
import HandTray from './HandTray';
import PromptForge from './PromptForge';
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
            className="text-center mb-8 text-amber-800 p-4 bg-amber-50/80 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-serif mb-2">Welcome to the Promptcraft Guild</h2>
            <p>Drag a card to begin your challenge.</p>
          </motion.div>
        );
        
      case 'compose':
        return (
          <Timer timeRemaining={state.timeRemaining} isActive={state.isTimerActive} />
        );
        
      case 'score':
        return (
          <div className="text-center mb-8">
            <div className="animate-bounce inline-block">
              <Sparkles className="text-amber-500" size={32} />
            </div>
            <p className="text-amber-800">Evaluating your prompt...</p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen pt-8 pb-48">
        <header className="container mx-auto mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Scroll className="text-amber-700 mr-2" />
            <h1 className="text-2xl font-serif font-bold text-amber-900">Promptcraft Guild</h1>
          </div>
          <div className="text-sm text-amber-800">
            Level: {state.level} | Streak: {state.streak}/2
          </div>
        </header>
        
        <main className="container mx-auto px-4">
          {renderGamePhase()}
          
          <div className="max-w-2xl mx-auto">
            <PromptForge
              slots={state.slots}
              promptText={state.promptText}
              tokenCount={state.tokenCount}
              tokenLimit={state.tokenLimit}
              isScoring={state.phase === 'score'}
              onPromptChange={updatePrompt}
              onSubmit={submitPrompt}
            />
          </div>
        </main>
        
        <HandTray cards={state.hand} activeId={activeId} />
        
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