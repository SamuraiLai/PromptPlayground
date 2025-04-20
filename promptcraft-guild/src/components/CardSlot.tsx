import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import PlayCard from './PlayCard';
import { Card, CardType } from '../types';

interface CardSlotProps {
  type: CardType;
  card: Card | null;
  label: string;
}

const CardSlot: React.FC<CardSlotProps> = ({ type, card, label }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${type}`,
    data: {
      type,
      accepts: type
    }
  });
  
  // Border color based on slot type
  const borderColorClass = type === 'mentor' 
    ? 'border-mentor/30' 
    : type === 'method' 
      ? 'border-method/30' 
      : 'border-modifier/30';
      
  // Border style when slot is empty or has a hover state
  const borderClass = card 
    ? 'border-transparent' 
    : isOver 
      ? `border-2 ${borderColorClass} bg-${type}/5` 
      : `border-2 border-dashed ${borderColorClass}`;
  
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="text-sm font-mono uppercase mb-1 tracking-wide text-gray-600">{label}</div>
      <motion.div
        ref={setNodeRef}
        className={`card-slot ${borderClass} transition-colors duration-200`}
        animate={{ 
          borderColor: isOver ? `var(--color-${type})` : undefined,
          backgroundColor: isOver ? `rgba(var(--color-${type}-rgb), 0.05)` : undefined
        }}
      >
        {card ? (
          <PlayCard card={card} isInSlot={true} />
        ) : (
          <div className="text-xs text-gray-400 italic">Drop {type} card here</div>
        )}
      </motion.div>
    </div>
  );
};

export default CardSlot; 