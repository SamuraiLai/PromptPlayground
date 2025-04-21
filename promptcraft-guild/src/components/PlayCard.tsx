import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Card as CardType } from '../types';

interface PlayCardProps {
  card: CardType;
  isDragging?: boolean;
  isInSlot?: boolean;
}

const PlayCard: React.FC<PlayCardProps> = ({ card, isDragging = false, isInSlot = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: {
      card
    }
  });
  
  // Safely get the icon component from LucideIcons
  let IconComponent: React.ElementType | null = null;
  if (card.icon && typeof card.icon === 'string' && card.icon in LucideIcons) {
    IconComponent = LucideIcons[card.icon as keyof typeof LucideIcons] as React.ElementType;
  }
  
  // Determine card class based on type
  const cardClass = `${card.type}-card`;
  const titleClass = `${card.type}-title`;
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 10,
    opacity: 0.8
  } : undefined;
  
  // Don't make card draggable if it's in a slot (can still be dragged back to hand)
  const dragAttributes = isInSlot ? {} : { ...attributes, ...listeners };
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`${cardClass} w-48 min-w-48 h-auto select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.02 }}
      {...dragAttributes}
    >
      <div className={titleClass}>
        {card.title}
      </div>
      <div className="card-content">
        <div className="flex items-start mb-2">
          {IconComponent && <IconComponent className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />}
          <p className="text-sm">{card.content}</p>
        </div>
        {card.tokenCost > 0 && (
          <div className="mt-2 text-right text-xs bg-gray-100 px-2 py-1 rounded-sm inline-block ml-auto">
            <span className="font-mono">{card.tokenCost} tokens</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlayCard; 