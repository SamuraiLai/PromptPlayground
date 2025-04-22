import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PlayCard from './PlayCard';
import { Card, CardType } from '../types';

interface CardSlotProps {
  type: CardType;
  card: Card | null;
  label: string;
  glow?: string;
  availableCards?: Card[];
}

const CardSlot: React.FC<CardSlotProps> = ({ type, card, label, glow, availableCards = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
  
  // Get the color values based on the glow color
  const getGlowValues = () => {
    switch(glowColor) {
      case 'indigo':
      case 'primary':
        return {
          color: 'indigo',
          rgba: 'rgba(79, 70, 229, 0.7)',
          rgbaLight: 'rgba(79, 70, 229, 0.3)',
          ring: 'ring-indigo-400',
          bg: 'bg-indigo-900/10',
          border: 'border-indigo-500/20',
          indicator: 'bg-indigo-500/60',
          text: 'text-indigo-200',
          expandBg: 'bg-indigo-900/80'
        };
      case 'emerald':
      case 'secondary':
        return {
          color: 'emerald',
          rgba: 'rgba(16, 185, 129, 0.7)',
          rgbaLight: 'rgba(16, 185, 129, 0.3)',
          ring: 'ring-emerald-400',
          bg: 'bg-emerald-900/10',
          border: 'border-emerald-500/20',
          indicator: 'bg-emerald-500/60',
          text: 'text-emerald-200',
          expandBg: 'bg-emerald-900/80'
        };
      case 'amber':
      case 'accent':
        return {
          color: 'amber',
          rgba: 'rgba(245, 158, 11, 0.7)',
          rgbaLight: 'rgba(245, 158, 11, 0.3)',
          ring: 'ring-amber-400',
          bg: 'bg-amber-900/10',
          border: 'border-amber-500/20',
          indicator: 'bg-amber-500/60',
          text: 'text-amber-200',
          expandBg: 'bg-amber-900/80'
        };
      default:
        return {
          color: 'amber',
          rgba: 'rgba(245, 158, 11, 0.7)',
          rgbaLight: 'rgba(245, 158, 11, 0.3)',
          ring: 'ring-amber-400',
          bg: 'bg-amber-900/10',
          border: 'border-amber-500/20',
          indicator: 'bg-amber-500/60',
          text: 'text-amber-200',
          expandBg: 'bg-amber-900/80'
        };
    }
  };
  
  const glowValues = getGlowValues();
  
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div className={`text-sm uppercase tracking-wide ${glowValues.text} font-serif font-semibold`}>
            {label}
          </div>
          
          {availableCards.length > 0 && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`${glowValues.text} p-1 rounded-full hover:bg-white/10`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </motion.button>
          )}
        </div>
        
        <motion.div
          ref={setNodeRef}
          className={`relative h-48 rounded-lg overflow-hidden backdrop-blur-sm ${
            card ? '' : 'flex items-center justify-center'
          } ${isOver ? `ring-2 ${glowValues.ring}` : ''}`}
          style={{
            width: '100%',
            background: card ? 'transparent' : 'rgba(0, 0, 0, 0.15)',
            border: card ? 'none' : `2px dashed ${glowValues.rgbaLight}`
          }}
          animate={{
            boxShadow: isOver 
              ? `0 0 20px 3px ${glowValues.rgba}` 
              : card 
                ? `0 0 10px 1px ${glowValues.rgbaLight}` 
                : 'none'
          }}
          transition={{ 
            duration: 0.3,
            repeat: isOver && !card ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {/* Pulse animation when empty and hovered */}
          {isOver && !card && (
            <motion.div 
              className={`absolute inset-2 rounded-md ${glowValues.bg}`}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          
          {/* Subtle inner glow effect */}
          <div className={`absolute inset-0 ${card ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 pointer-events-none ${glowValues.bg}`} />
          
          {card ? (
            <PlayCard card={card} isInSlot={true} />
          ) : (
            <div className="text-sm italic px-4 text-center font-serif text-amber-200/70 z-10">
              {label} Card
            </div>
          )}
          
          {/* Glow indicator at bottom of slot */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${glowValues.indicator}`} />
        </motion.div>
      </div>
      
      {/* Expandable card selection */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden mt-2 rounded-lg p-3 ${glowValues.expandBg} backdrop-blur-sm z-30 border ${glowValues.border}`}
          >
            <h3 className={`text-xs uppercase mb-2 ${glowValues.text} font-medium`}>Available {label} Cards</h3>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {availableCards.map((availableCard) => (
                <div key={availableCard.id} className="transform transition-transform hover:scale-[1.03]">
                  <PlayCard 
                    card={availableCard}
                    isInSlot={false}
                    scale={0.8}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardSlot; 