import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, isActive }) => {
  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Calculate percentage for the circular progress
  const totalInitialTime = 45; // Assuming 45 seconds is the initial time
  const percentage = (timeRemaining / totalInitialTime) * 100;
  
  // Determine colors based on time remaining
  let colors = {
    bg: 'bg-emerald-600',
    text: 'text-emerald-100',
    glow: '0 0 10px rgba(4, 120, 87, 0.7)',
    ring: 'ring-emerald-400'
  };
  
  if (timeRemaining <= 10) {
    colors = {
      bg: 'bg-red-600',
      text: 'text-red-100',
      glow: '0 0 15px rgba(220, 38, 38, 0.8)',
      ring: 'ring-red-400'
    };
  } else if (timeRemaining <= 20) {
    colors = {
      bg: 'bg-amber-600',
      text: 'text-amber-100',
      glow: '0 0 12px rgba(180, 83, 9, 0.75)',
      ring: 'ring-amber-400'
    };
  }
  
  return (
    <motion.div 
      className="flex items-center bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg ring-1 ring-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isActive && timeRemaining <= 10 ? [colors.glow, '0 0 5px rgba(0,0,0,0.3)', colors.glow] : '0 0 5px rgba(0,0,0,0.3)'
      }}
      transition={{ 
        duration: 0.4,
        boxShadow: { duration: 0.5, repeat: isActive && timeRemaining <= 10 ? Infinity : 0, repeatType: 'reverse' }
      }}
    >
      {/* Clock icon */}
      <div className="relative mr-3">
        <motion.div 
          className={`p-1 rounded-full ${colors.ring}`}
          animate={{ 
            scale: isActive && timeRemaining <= 10 ? [1, 1.1, 1] : 1 
          }}
          transition={{ 
            duration: 0.5, 
            repeat: isActive && timeRemaining <= 10 ? Infinity : 0 
          }}
        >
          <Clock className={`w-5 h-5 ${colors.text}`} />
        </motion.div>
        
        {/* Circular progress indicator */}
        <svg 
          className="absolute -inset-1 -z-10" 
          width="36" 
          height="36" 
          viewBox="0 0 36 36"
        >
          <circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            className="stroke-gray-700/40" 
            strokeWidth="2" 
          />
          <motion.circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            className={`stroke-current ${colors.text}`}
            strokeWidth="2" 
            strokeDasharray="100" 
            strokeDashoffset={100 - percentage}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - percentage }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </div>
      
      {/* Time display */}
      <div className="font-mono font-bold">
        <motion.div
          className={`text-lg ${colors.text}`}
          initial={{ scale: 1 }}
          animate={{ 
            scale: isActive && timeRemaining <= 10 ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            duration: 0.5, 
            repeat: isActive && timeRemaining <= 10 ? Infinity : 0
          }}
        >
          {formattedTime}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Timer; 