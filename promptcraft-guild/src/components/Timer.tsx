import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, isActive }) => {
  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Determine color based on time remaining
  let color = 'text-gray-600';
  if (timeRemaining <= 10) {
    color = 'text-energy-low';
  } else if (timeRemaining <= 20) {
    color = 'text-energy-medium';
  }
  
  return (
    <div className="flex items-center justify-center mb-4">
      <div className={`text-xl font-mono ${color} ${isActive ? 'animate-pulse' : ''}`}>
        {isActive ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: timeRemaining <= 10 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeRemaining <= 10 ? Infinity : 0 }}
          >
            {formattedTime}
          </motion.div>
        ) : (
          formattedTime
        )}
      </div>
    </div>
  );
};

export default Timer; 