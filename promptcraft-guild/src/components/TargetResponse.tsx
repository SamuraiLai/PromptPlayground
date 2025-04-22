import React from 'react';
import { motion } from 'framer-motion';
import { Target, MessageSquare } from 'lucide-react';

interface TargetResponseProps {
  targetText: string;
  currentScore?: number;
  maxScore?: number;
}

const TargetResponse: React.FC<TargetResponseProps> = ({ 
  targetText, 
  currentScore = 0, 
  maxScore = 100 
}) => {
  return (
    <motion.div 
      className="mb-6 rounded-lg overflow-hidden border-2 border-indigo-500/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-indigo-900/30 backdrop-blur-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Target className="text-indigo-300 w-4 h-4 mr-2" />
          <h3 className="text-indigo-300 font-serif font-bold">Target Response</h3>
        </div>
        
        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
          <span className="text-amber-300 font-mono text-xs mr-2">Match Score:</span>
          <span className="text-white font-bold">{currentScore}/{maxScore}</span>
        </div>
      </div>
      
      <div className="bg-black/20 p-4 font-serif text-amber-100">
        <div className="flex">
          <MessageSquare className="text-indigo-400 w-5 h-5 mr-3 flex-shrink-0 mt-1" />
          <p className="italic">{targetText}</p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-indigo-900/30">
          <p className="text-sm text-indigo-200">
            <span className="font-semibold">Goal:</span> Create a prompt that would generate this exact response
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TargetResponse; 