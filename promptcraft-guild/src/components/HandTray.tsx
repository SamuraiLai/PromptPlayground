import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import PlayCard from './PlayCard';
import { Card } from '../types';

interface HandTrayProps {
  cards: Card[];
  activeId: string | null;
}

const HandTray: React.FC<HandTrayProps> = ({ cards, activeId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'hand-tray',
    data: {
      type: 'hand'
    }
  });
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-woodTable border-t border-amber-900/20 shadow-lg py-4 px-6"
    >
      <div className="text-center mb-2 text-amber-900 text-sm font-semibold">Your Hand</div>
      <div 
        ref={setNodeRef}
        className={`flex gap-4 justify-center overflow-x-auto pb-2 min-h-32 ${
          isOver ? 'bg-amber-100/20 rounded-xl' : ''
        }`}
      >
        {cards.length === 0 ? (
          <div className="text-amber-900/50 italic flex items-center">
            No cards in hand
          </div>
        ) : (
          cards.map(card => (
            <motion.div 
              key={card.id}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <PlayCard 
                card={card} 
                isDragging={activeId === card.id}
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default HandTray; 