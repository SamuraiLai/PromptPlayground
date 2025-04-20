import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackDisplayProps {
  result: 'success' | 'failure' | 'pending';
  feedback: string;
  suggestions: string[];
  onContinue: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  result,
  feedback,
  suggestions,
  onContinue
}) => {
  if (result === 'pending') return null;
  
  const isSuccess = result === 'success';
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-table rounded-xl shadow-xl max-w-xl w-full p-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-center mb-4">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle size={48} className="text-energy-high" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <XCircle size={48} className="text-energy-low" />
            </motion.div>
          )}
        </div>
        
        <div className="text-center mb-6">
          <h2 className={`text-xl font-serif font-semibold mb-2 ${isSuccess ? 'text-energy-high' : 'text-energy-low'}`}>
            {isSuccess ? 'Success!' : 'Not Quite Right'}
          </h2>
          <p className="text-gray-800">{feedback}</p>
        </div>
        
        {suggestions.length > 0 && (
          <div className="mb-6 bg-white/70 rounded-md p-4">
            <h3 className="text-sm font-mono uppercase mb-2 text-gray-600">Suggestions</h3>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-center">
          <motion.button
            onClick={onContinue}
            className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackDisplay; 