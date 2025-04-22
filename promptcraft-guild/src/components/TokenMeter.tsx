import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';

interface TokenMeterProps {
  currentTokens: number;
  maxTokens: number;
  warningThreshold?: number; // Percentage (0-100) when to show warning color
  criticalThreshold?: number; // Percentage (0-100) when to show critical color
}

const TokenMeter: React.FC<TokenMeterProps> = ({ 
  currentTokens, 
  maxTokens, 
  warningThreshold = 70, 
  criticalThreshold = 90 
}) => {
  const percentage = Math.min(100, (currentTokens / maxTokens) * 100);
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= criticalThreshold) return 'bg-red-500';
    if (percentage >= warningThreshold) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  
  // Get text color class based on percentage
  const getTextColor = () => {
    if (percentage >= criticalThreshold) return 'text-red-400';
    if (percentage >= warningThreshold) return 'text-amber-400';
    return 'text-emerald-400';
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between mb-1">
        <div className="flex items-center text-lg font-medium text-amber-300">
          <Hash size={18} className="mr-1" />
          <span>Tokens</span>
        </div>
        <div className={`${getTextColor()} font-mono font-bold`}>
          {currentTokens} / {maxTokens}
        </div>
      </div>
      
      <div className="w-full h-3 bg-slate-800/70 rounded-full overflow-hidden border border-slate-700">
        <motion.div 
          className={`h-full ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 60, 
            damping: 15
          }}
        />
      </div>
      
      {/* Animated pips for meter */}
      <div className="w-full flex justify-between mt-1 px-1">
        {[0, 25, 50, 75, 100].map((mark) => (
          <motion.div 
            key={mark}
            className={`w-1 h-1 rounded-full ${mark <= percentage ? getColor() : 'bg-slate-600'}`}
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ 
              opacity: mark <= percentage ? 1 : 0.5,
              scale: mark <= percentage ? 1 : 0.8
            }}
            transition={{ delay: mark * 0.005 }}
          />
        ))}
      </div>
      
      {percentage >= warningThreshold && (
        <motion.p 
          className={`text-xs mt-1 ${getTextColor()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {percentage >= criticalThreshold 
            ? "Warning: Token limit nearly reached!" 
            : "Note: Approaching token limit"}
        </motion.p>
      )}
    </div>
  );
};

export default TokenMeter; 