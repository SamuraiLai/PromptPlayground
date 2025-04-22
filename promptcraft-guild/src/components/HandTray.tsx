import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import PlayCard from './PlayCard';
import { Card } from '../types';

interface HandTrayProps {
  cards: Card[];
  activeId: string | null;
}

const HandTray: React.FC<HandTrayProps> = ({ cards, activeId }) => {
  const { setNodeRef } = useDroppable({
    id: 'hand-tray',
  });
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate the spacing and fan effect
  const getCardPosition = (index: number, total: number) => {
    // Base position with fan effect
    const baseX = (index - (total - 1) / 2) * 30; // Slightly overlap cards
    
    // Apply peek effect when card is hovered
    const isPeekActive = hoveredIndex !== null;
    const peekOffset = isPeekActive ? 40 : 0; // Amount to spread cards when peeking
    
    let adjustedX = baseX;
    
    if (isPeekActive) {
      if (index < hoveredIndex) {
        adjustedX = baseX - peekOffset;
      } else if (index > hoveredIndex) {
        adjustedX = baseX + peekOffset;
      }
    }
    
    // Calculate slight arc (cards on edges are slightly higher)
    const normalizedIndex = index / (total - 1 || 1); // Avoid division by zero
    const arcHeight = -10; // Height of the arc (negative goes down)
    const y = arcHeight * Math.sin(Math.PI * normalizedIndex);
    
    // Calculate slight rotation for fan effect
    const maxRotation = 8; // Maximum rotation in degrees
    const rotation = maxRotation * (index / (total - 1 || 1) - 0.5) * 2;
    
    return { x: adjustedX, y, rotation };
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <motion.div 
        className="bg-gradient-to-t from-green-950 to-green-900/90 shadow-[0_-4px_6px_rgba(0,0,0,0.3)] border-t border-amber-900/30 pt-3 pb-6 px-6"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="text-center mb-2">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-900/30 text-amber-200 text-sm font-medium">Your Hand</span>
        </div>
        <div 
          ref={setNodeRef}
          className="flex justify-center min-h-[180px] overflow-visible pb-2 relative" 
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence>
            {cards.length === 0 ? (
              <div className="text-amber-400/60 italic flex items-center h-40 justify-center font-serif">
                No cards in hand
              </div>
            ) : (
              cards.map((card, index) => {
                const { x, y, rotation } = getCardPosition(index, cards.length);
                
                return (
                  <motion.div 
                    key={card.id}
                    layout
                    initial={{ opacity: 0, rotateX: -30, y: 50 }}
                    animate={{ 
                      opacity: 1, 
                      rotateX: 0, 
                      y: y,
                      x: x,
                      rotate: rotation,
                      scale: hoveredIndex === index ? 1.1 : 1,
                      zIndex: hoveredIndex === index ? 10 : cards.length - index,
                    }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30 
                    }}
                    className="origin-bottom absolute"
                    style={{ 
                      transformStyle: "preserve-3d",
                      transform: `translateX(-50%) translateY(0%)`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <PlayCard 
                      card={card} 
                      isDragging={activeId === card.id}
                      index={index}
                      totalCards={cards.length}
                      scale={hoveredIndex === index ? 1.1 : 1}
                    />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HandTray; 