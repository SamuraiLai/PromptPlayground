import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import PlayCard from './PlayCard';
import { Card, CardType } from '../types';

interface CardSlotProps {
  type: CardType;
  card: Card | null;
  label: string;
  glow?: string;
}

const CardSlot: React.FC<CardSlotProps> = ({ type, card, label, glow }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${type}`,
    data: {
      type,
      accepts: type
    }
  });
  
  // Determine the glow color, defaulting to the type color if not specified
  const glowColor = glow || (
    type === 'mentor' ? 'indigo' : 
    type === 'method' ? 'emerald' : 
    'amber'
  );
  
  // Animation for the glow effect  
  const glowAnimation = {
    animate: {
      boxShadow: isOver 
        ? `0 0 15px 2px ${glowColor === 'indigo' ? 'rgba(67, 56, 202, 0.7)' : 
            glowColor === 'emerald' ? 'rgba(4, 120, 87, 0.7)' : 
            'rgba(180, 83, 9, 0.7)'}`
        : `0 0 5px 0px ${glowColor === 'indigo' ? 'rgba(67, 56, 202, 0.3)' : 
            glowColor === 'emerald' ? 'rgba(4, 120, 87, 0.3)' : 
            'rgba(180, 83, 9, 0.3)'}`
    },
    transition: { duration: 0.3 }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm uppercase mb-2 tracking-wide text-amber-300 font-serif font-semibold">{label}</div>
      <motion.div
        ref={setNodeRef}
        className={`relative h-48 rounded-lg overflow-hidden backdrop-blur-sm ${
          card ? '' : 'flex items-center justify-center'
        } ${isOver ? 'ring-2' : ''} ${
          isOver && glowColor === 'indigo' ? 'ring-indigo-400' :
          isOver && glowColor === 'emerald' ? 'ring-emerald-400' :
          isOver && glowColor === 'amber' ? 'ring-amber-400' : ''
        }`}
        style={{
          width: '160px',
          background: card ? 'transparent' : 'rgba(0, 0, 0, 0.15)',
          border: card ? 'none' : `2px dashed ${
            glowColor === 'indigo' ? 'rgba(67, 56, 202, 0.3)' :
            glowColor === 'emerald' ? 'rgba(4, 120, 87, 0.3)' :
            'rgba(180, 83, 9, 0.3)'
          }`
        }}
        {...glowAnimation}
      >
        {/* Subtle inner glow effect */}
        <div className={`absolute inset-0 ${card ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 pointer-events-none
          ${glowColor === 'indigo' ? 'bg-indigo-900/10' :
            glowColor === 'emerald' ? 'bg-emerald-900/10' :
            'bg-amber-900/10'
          }`}
        />
        
        {card ? (
          <PlayCard card={card} isInSlot={true} />
        ) : (
          <div className="text-sm italic px-4 text-center font-serif text-amber-200/70">{label} Card</div>
        )}
        
        {/* Glow indicator at bottom of slot */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${
          glowColor === 'indigo' ? 'bg-indigo-500/60' :
          glowColor === 'emerald' ? 'bg-emerald-500/60' :
          'bg-amber-500/60'
        }`} />
      </motion.div>
    </div>
  );
};

export default CardSlot; 