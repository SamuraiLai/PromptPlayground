import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Star, ArrowRight, Feather } from 'lucide-react';

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
  
  // Success decorative elements
  const SuccessDecorations = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div 
          key={i}
          className="absolute"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0, 
            opacity: 0 
          }}
          animate={{ 
            x: Math.sin(i * 45 * (Math.PI/180)) * 130, 
            y: Math.cos(i * 45 * (Math.PI/180)) * 130,
            scale: [0, 1.3, 1],
            opacity: [0, 1, 0.7]
          }}
          transition={{ 
            delay: 0.2 + (i * 0.05),
            duration: 0.8,
          }}
          style={{ 
            top: '50%', 
            left: '50%'
          }}
        >
          <Star size={i % 2 === 0 ? 20 : 16} className="text-amber-400" fill="#f59e0b" />
        </motion.div>
      ))}
    </>
  );
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative max-w-xl w-full">
        {isSuccess && <SuccessDecorations />}
        
        <motion.div
          className="relative backdrop-blur-md bg-gradient-to-b from-amber-900/90 to-amber-950/90 rounded-xl shadow-2xl border border-amber-500/30 overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Decorative top banner */}
          <div className={`h-2 w-full ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          
          <div className="p-8">
            {/* Icon and title */}
            <div className="flex flex-col items-center justify-center mb-6 relative">
              <motion.div 
                className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  isSuccess ? 'bg-emerald-700' : 'bg-red-700'
                } mb-4`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20, 
                  delay: 0.1 
                }}
              >
                {isSuccess ? (
                  <CheckCircle size={40} className="text-emerald-100" />
                ) : (
                  <XCircle size={40} className="text-red-100" />
                )}
              </motion.div>
              
              <h2 className={`text-2xl font-serif font-bold mb-2 ${
                isSuccess ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {isSuccess ? 'Masterful Prompt!' : 'Needs Refinement'}
              </h2>
              
              <motion.div 
                className="absolute -z-10 h-40 w-40 rounded-full opacity-20"
                initial={{ scale: 0 }}
                animate={{ scale: 3, opacity: [0, 0.1, 0.05] }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                  background: isSuccess 
                    ? 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(4,120,87,0) 70%)' 
                    : 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(153,27,27,0) 70%)'
                }}
              />
            </div>
            
            {/* Feedback text */}
            <div className="mb-6">
              <div className="bg-black/30 border border-amber-800/40 rounded-lg p-4 mb-4">
                <div className="flex items-start mb-2">
                  <Feather className="h-5 w-5 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-amber-100 italic font-serif">{feedback}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div 
                className="mb-6 bg-black/20 border border-amber-800/40 rounded-lg p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-serif uppercase mb-3 tracking-wider text-amber-300">Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start text-amber-100"
                    >
                      <div className="rounded-full bg-amber-800/40 p-1 mr-2 mt-0.5 flex-shrink-0">
                        <Star className="h-3 w-3 text-amber-300" />
                      </div>
                      <span className="text-sm">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {/* Continue button */}
            <div className="flex justify-center">
              <motion.button
                onClick={onContinue}
                className={`px-6 py-3 rounded-lg font-serif font-bold text-white flex items-center text-lg shadow-lg ${
                  isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(180, 83, 9, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeedbackDisplay; 