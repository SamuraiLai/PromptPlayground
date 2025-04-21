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
  
  // Get color theme based on card type
  const getCardColors = () => {
    switch(card.type) {
      case 'mentor':
        return {
          bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
          border: 'border-indigo-300',
          titleBg: 'bg-indigo-700',
          titleText: 'text-indigo-50',
          highlight: 'bg-indigo-600',
          shadow: '0 0 10px rgba(67, 56, 202, 0.3)',
          tokenBg: 'bg-indigo-100',
          tokenBorder: 'border-indigo-200',
          tokenText: 'text-indigo-800'
        };
      case 'method':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
          border: 'border-emerald-300',
          titleBg: 'bg-emerald-700',
          titleText: 'text-emerald-50',
          highlight: 'bg-emerald-600',
          shadow: '0 0 10px rgba(4, 120, 87, 0.3)',
          tokenBg: 'bg-emerald-100',
          tokenBorder: 'border-emerald-200',
          tokenText: 'text-emerald-800'
        };
      case 'modifier':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
          border: 'border-amber-300',
          titleBg: 'bg-amber-700',
          titleText: 'text-amber-50',
          highlight: 'bg-amber-600',
          shadow: '0 0 10px rgba(180, 83, 9, 0.3)',
          tokenBg: 'bg-amber-100',
          tokenBorder: 'border-amber-200',
          tokenText: 'text-amber-800'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-300',
          titleBg: 'bg-gray-700',
          titleText: 'text-gray-50',
          highlight: 'bg-gray-600',
          shadow: '0 0 10px rgba(107, 114, 128, 0.3)',
          tokenBg: 'bg-gray-100',
          tokenBorder: 'border-gray-200',
          tokenText: 'text-gray-800'
        };
    }
  };
  
  const colors = getCardColors();
  
  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) ${isDragging ? 'rotate(4deg)' : ''}`,
    zIndex: 10,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
  } : undefined;
  
  // Don't make card draggable if it's in a slot (can still be dragged back to hand)
  const dragAttributes = isInSlot ? {} : { ...attributes, ...listeners };
  
  return (
    <motion.div
      ref={setNodeRef}
      style={dragStyle}
      className={`relative select-none rounded-lg overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={!isDragging ? { 
        scale: 1.05, 
        rotate: isInSlot ? 0 : 2, 
        y: -5,
        boxShadow: colors.shadow
      } : {}}
      style={{
        width: '160px',
        height: '200px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      {...dragAttributes}
    >
      {/* Card inner */}
      <div className={`relative h-full flex flex-col ${colors.bg} border ${colors.border}`}>
        {/* Card decoration - top corner */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
          <div className={`absolute transform rotate-45 translate-x-6 -translate-y-6 w-12 h-12 ${colors.highlight} opacity-40`}></div>
        </div>
        
        {/* Card title */}
        <div className={`p-2 ${colors.titleBg} ${colors.titleText} font-serif text-center font-bold tracking-wide text-sm`}>
          {card.title}
        </div>
        
        {/* Card content */}
        <div className="flex-grow p-3 flex flex-col justify-between">
          <div className="flex items-start mb-auto">
            {IconComponent && (
              <div className="mr-2 flex-shrink-0 p-1 rounded-full bg-white/60">
                <IconComponent className="w-4 h-4 text-gray-700" />
              </div>
            )}
            <p className="text-sm font-serif leading-tight text-gray-800">{card.content}</p>
          </div>
          
          {/* Token cost */}
          {card.tokenCost > 0 && (
            <div className="mt-2 flex justify-end">
              <div className={`px-2 py-1 rounded-full ${colors.tokenBg} border ${colors.tokenBorder} inline-flex items-center`}>
                <span className={`font-mono text-xs font-bold ${colors.tokenText}`}>{card.tokenCost}</span>
                <span className={`ml-1 text-xs ${colors.tokenText}`}>tokens</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Card decoration - embossed border */}
        <div className="absolute inset-0 pointer-events-none border-2 border-white/10 rounded-lg"></div>
      </div>
    </motion.div>
  );
};

export default PlayCard; 