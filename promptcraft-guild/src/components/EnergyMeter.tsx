import React from 'react';
import { motion } from 'framer-motion';

interface EnergyMeterProps {
  tokenCount: number;
  tokenLimit: number;
}

const EnergyMeter: React.FC<EnergyMeterProps> = ({ tokenCount, tokenLimit }) => {
  const percentage = Math.min((tokenCount / tokenLimit) * 100, 100);
  
  // Determine color based on token usage
  let color = 'bg-energy-high';
  if (percentage > 80) {
    color = 'bg-energy-low';
  } else if (percentage > 60) {
    color = 'bg-energy-medium';
  }
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-xs font-mono">
        <span className="text-gray-600">Prompt Energy</span>
        <span className={percentage > 90 ? 'text-energy-low font-semibold' : 'text-gray-600'}>
          {tokenCount} / {tokenLimit} tokens
        </span>
      </div>
      <div className="energy-meter">
        <motion.div
          className={`h-full ${color} transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default EnergyMeter; 