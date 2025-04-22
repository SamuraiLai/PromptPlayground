import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Trophy, Star } from 'lucide-react';

interface ChipStackProps {
  level: number;
  streak: number;
}

const ChipStack: React.FC<ChipStackProps> = ({ level, streak }) => {
  const chipColors = [
    'bg-indigo-300 border-indigo-600',
    'bg-emerald-300 border-emerald-600',
    'bg-amber-300 border-amber-600',
    'bg-rose-300 border-rose-600',
    'bg-sky-300 border-sky-600'
  ];
  
  // Chip animation component
  const AnimatedChip = ({ color, index, delay }: { color: string, index: number, delay: number }) => (
    <motion.div 
      className={`absolute w-12 h-12 rounded-full border-2 ${color} shadow-lg`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ 
        y: index * -4,
        opacity: 1,
        rotate: [0, 10, 0] 
      }}
      transition={{ 
        delay: delay,
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        rotate: { delay: delay + 0.3, duration: 0.5 }
      }}
      style={{ zIndex: 5 - index }}
    />
  );
  
  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring" }}
    >
      <div className="relative mr-3">
        {/* Stack of chips based on level */}
        {[...Array(Math.min(level, 5))].map((_, i) => (
          <AnimatedChip 
            key={i} 
            color={chipColors[i % chipColors.length]} 
            index={i} 
            delay={0.1 + i * 0.1} 
          />
        ))}
        
        {/* Top coin */}
        <motion.div 
          className="relative w-12 h-12 rounded-full bg-amber-400 border-2 border-amber-600 shadow-lg flex items-center justify-center z-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 + Math.min(level, 5) * 0.1, type: "spring" }}
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
        >
          <Trophy className="w-6 h-6 text-amber-800" />
        </motion.div>
      </div>
      
      <div className="text-right">
        <div className="text-amber-300 font-serif font-bold text-lg">Level {level}</div>
        <div className="text-amber-200 text-sm flex items-center">
          Streak: 
          <div className="flex ml-1">
            {[...Array(2)].map((_, i) => (
              <Star 
                key={i}
                size={14}
                className={`${i < streak ? 'text-amber-400 fill-amber-400' : 'text-amber-800/40'} ml-0.5`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChipStack; 