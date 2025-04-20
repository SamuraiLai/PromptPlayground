import React from 'react';
import { motion } from 'framer-motion';
import CardSlot from './CardSlot';
import EnergyMeter from './EnergyMeter';
import { SlotState } from '../types';

interface PromptForgeProps {
  slots: SlotState;
  promptText: string;
  tokenCount: number;
  tokenLimit: number;
  isScoring: boolean;
  onPromptChange: (text: string) => void;
  onSubmit: () => void;
}

const PromptForge: React.FC<PromptForgeProps> = ({
  slots,
  promptText,
  tokenCount,
  tokenLimit,
  isScoring,
  onPromptChange,
  onSubmit
}) => {
  const isSubmitDisabled = 
    !slots.mentor || 
    !slots.method || 
    !slots.modifier || 
    promptText.trim().length < 10 ||
    tokenCount > tokenLimit ||
    isScoring;
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      onSubmit();
    }
  };
  
  return (
    <motion.div 
      className="prompt-forge flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-lg font-serif text-center font-semibold mb-4">Prompt Forge</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CardSlot type="mentor" card={slots.mentor} label="Mentor" />
        <CardSlot type="method" card={slots.method} label="Method" />
        <CardSlot type="modifier" card={slots.modifier} label="Modifier" />
      </div>
      
      <EnergyMeter tokenCount={tokenCount} tokenLimit={tokenLimit} />
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={promptText}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Type your prompt here..."
          className="w-full h-32 p-3 border border-amber-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all font-serif"
          disabled={isScoring}
        />
        
        <div className="mt-4 flex justify-center">
          <motion.button
            type="submit"
            disabled={isSubmitDisabled}
            className={`px-6 py-2 rounded-md font-mono text-white transition-colors ${
              isSubmitDisabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            whileHover={!isSubmitDisabled ? { scale: 1.03 } : {}}
            whileTap={!isSubmitDisabled ? { scale: 0.98 } : {}}
          >
            {isScoring ? (
              <>
                <span className="mr-2">Evaluating</span>
                <span className="animate-pulse">...</span>
              </>
            ) : (
              'Cast Prompt'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PromptForge; 