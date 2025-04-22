import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Scroll, BookOpen, Wand2 } from 'lucide-react';
import CardSlot from './CardSlot';
import TargetResponse from './TargetResponse';
import TokenMeter from './TokenMeter';
import FeedbackDisplay from './FeedbackDisplay';
import { useGameState } from '../hooks/useGameState';
import { SlotState } from '../types';

const GameBoard: React.FC = () => {
  const {
    state,
    dragCard,
    updatePrompt,
    submitPrompt,
    nextRound
  } = useGameState();
  
  const handleDragStart = () => {
    // Empty handler to keep the DnD context happy
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const cardData = active.data.current?.card;
    if (!cardData) return;
    
    // Determine destination type from the droppable id
    if (typeof over.id === 'string' && over.id.startsWith('slot-')) {
      // Extract the slot type from the id (e.g., 'slot-mentor' -> 'mentor')
      const slotType = over.id.replace('slot-', '') as keyof SlotState;
      // Validate that slotType is a valid key for SlotState
      if (slotType === 'mentor' || slotType === 'method' || slotType === 'modifier') {
        // Dispatch drag card action
        dragCard(cardData, slotType);
      }
    }
  };
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen relative overflow-hidden bg-green-900 bg-opacity-95 flex flex-col">
        {/* Wood texture background */}
        <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <header className="relative z-10 py-4 px-6 shadow-lg bg-gradient-to-b from-green-950 to-green-900 border-b border-amber-900/20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Scroll className="text-amber-300 mr-2" size={28} />
              <h1 className="text-3xl font-serif font-bold text-amber-100">Promptcraft Guild</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-1 rounded-full bg-amber-900/30 text-amber-200 text-sm">
                Level {state.level}
              </div>
              <div className="px-4 py-1 rounded-full bg-amber-900/30 text-amber-200 text-sm">
                Score: {state.streak}/3
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-grow relative flex flex-col py-8 px-6">
          <div className="flex w-full max-w-7xl mx-auto gap-6 h-full">
            {/* Left Column - Card Slots */}
            <motion.div 
              className="w-1/4 flex flex-col gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-amber-900/20 shadow-lg">
                <h2 className="text-lg font-serif text-amber-200 mb-4 flex items-center">
                  <Wand2 className="mr-2 text-amber-400" size={18} />
                  The Arcane Components
                </h2>
                <div className="space-y-6">
                  <CardSlot 
                    type="mentor" 
                    card={state.slots.mentor} 
                    label="Mentor" 
                    glow="indigo"
                    availableCards={state.cardLibrary.filter(card => card.type === 'mentor')}
                  />
                  <CardSlot 
                    type="method" 
                    card={state.slots.method} 
                    label="Method" 
                    glow="emerald"
                    availableCards={state.cardLibrary.filter(card => card.type === 'method')}
                  />
                  <CardSlot 
                    type="modifier" 
                    card={state.slots.modifier} 
                    label="Modifier" 
                    glow="amber"
                    availableCards={state.cardLibrary.filter(card => card.type === 'modifier')}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Middle Column - Prompt Forge */}
            <motion.div 
              className="w-2/5 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-full flex flex-col">
                <div className="bg-[url('/parchment.svg')] bg-cover bg-center p-6 rounded-lg shadow-lg border border-amber-900/30 flex-grow">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-serif text-amber-900 font-bold">The Prompt Forge</h2>
                  </div>
                  
                  {/* Token meter */}
                  <div className="mb-4">
                    <TokenMeter 
                      currentTokens={state.tokenCount} 
                      maxTokens={state.tokenLimit} 
                    />
                  </div>
                  
                  {/* Prompt Text Area */}
                  <div className="relative flex-grow">
                    <textarea
                      value={state.promptText}
                      onChange={(e) => updatePrompt(e.target.value)}
                      placeholder="Forge your prompt incantation here..."
                      className="w-full h-64 p-4 bg-amber-50/80 border border-amber-900/30 rounded-lg text-amber-900 placeholder-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-serif"
                      disabled={state.phase === 'score'}
                    />
                    
                    <motion.button
                      type="button"
                      onClick={submitPrompt}
                      disabled={!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score'}
                      className={`mt-4 w-full px-6 py-3 rounded-md font-serif text-lg shadow-lg ${
                        (!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score')
                          ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                          : 'bg-amber-700 text-amber-50 hover:bg-amber-600'
                      }`}
                      whileHover={!(!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score') ? { scale: 1.02, backgroundColor: "#b45309" } : {}}
                      whileTap={!(!state.slots.mentor || !state.slots.method || !state.slots.modifier || state.promptText.trim().length < 10 || state.tokenCount > state.tokenLimit || state.phase === 'score') ? { scale: 0.98 } : {}}
                    >
                      {state.phase === 'score' ? (
                        <>
                          <span className="mr-2">Divining Results</span>
                          <span className="animate-pulse">...</span>
                        </>
                      ) : (
                        'Cast Your Incantation'
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Target Response & Output */}
            <motion.div 
              className="w-1/3 flex flex-col gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Target Response */}
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/30 shadow-lg">
                <h2 className="text-lg font-serif text-indigo-200 mb-4 flex items-center">
                  <BookOpen className="mr-2 text-indigo-400" size={18} />
                  Target Response
                </h2>
                <TargetResponse 
                  targetText={state.targetResponse || "Your challenge will appear here once you've selected your components."}
                  currentScore={state.matchScore}
                  maxScore={100}
                />
              </div>
              
              {/* User's Response Output */}
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-emerald-500/30 shadow-lg flex-grow">
                <h2 className="text-lg font-serif text-emerald-200 mb-2">The Oracle's Response</h2>
                <div className="bg-black/30 rounded-lg p-4 min-h-40 text-emerald-100 font-serif">
                  {state.generatedResponse ? (
                    <p>{state.generatedResponse}</p>
                  ) : (
                    <p className="italic text-emerald-300/50">The oracle awaits your incantation...</p>
                  )}
                </div>
                
                {/* Feedback area - only show when there's feedback */}
                {state.feedback && (
                  <div className="mt-4 border-t border-emerald-900/30 pt-4">
                    <h3 className="text-sm font-bold text-emerald-300 mb-2">Arcane Feedback:</h3>
                    <p className="text-sm text-emerald-200">{state.feedback}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
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