import React, { CSSProperties, useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Card as CardType } from '../types';

interface PlayCardProps {
  card: CardType;
  isDragging?: boolean;
  isInSlot?: boolean;
  index?: number; // Used for fan effect
  totalCards?: number; // Used for fan effect
  scale?: number; // Used for custom scaling
}

const PlayCard: React.FC<PlayCardProps> = ({ 
  card, 
  isDragging = false, 
  isInSlot = false,
  index = 0,
  totalCards = 1,
  scale = 1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth movement
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  
  // Glow position values
  const glowX = useSpring(useMotionValue(50), springConfig);
  const glowY = useSpring(useMotionValue(50), springConfig);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: {
      card
    }
  });
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered || isDragging || isInSlot) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (in percentage)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseXRelative = (e.clientX - centerX) / (rect.width / 2);
    const mouseYRelative = (e.clientY - centerY) / (rect.height / 2);
    
    // Update rotation values (inverted for natural movement)
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
    
    // Calculate rotation based on mouse position (limited to 10 degrees)
    rotateY.set(mouseXRelative * 10);
    rotateX.set(mouseYRelative * -10); // Inverted for natural feel
    
    // Update glow position (in percentage) for spotlight effect
    const glowPosX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowPosY = ((e.clientY - rect.top) / rect.height) * 100;
    
    glowX.set(glowPosX);
    glowY.set(glowPosY);
  };
  
  // Reset rotation on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    mouseX.set(0);
    mouseY.set(0);
    rotateX.set(0);
    rotateY.set(0);
    
    // Reset glow to center
    glowX.set(50);
    glowY.set(50);
  };
  
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
          shadow: '0 0 10px rgba(79, 70, 229, 0.3)',
          hoverShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22), 0 0 15px rgba(79, 70, 229, 0.4)',
          tokenBg: 'bg-indigo-100',
          tokenBorder: 'border-indigo-200',
          tokenText: 'text-indigo-800',
          glowColor: 'rgba(79, 70, 229, 0.6)',
          glowColorStart: 'rgba(99, 102, 241, 0.8)',
          glowColorEnd: 'rgba(79, 70, 229, 0)'
        };
      case 'method':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
          border: 'border-emerald-300',
          titleBg: 'bg-emerald-700',
          titleText: 'text-emerald-50',
          highlight: 'bg-emerald-600',
          shadow: '0 0 10px rgba(16, 185, 129, 0.3)',
          hoverShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22), 0 0 15px rgba(16, 185, 129, 0.4)',
          tokenBg: 'bg-emerald-100',
          tokenBorder: 'border-emerald-200',
          tokenText: 'text-emerald-800',
          glowColor: 'rgba(16, 185, 129, 0.6)',
          glowColorStart: 'rgba(52, 211, 153, 0.8)',
          glowColorEnd: 'rgba(16, 185, 129, 0)'
        };
      case 'modifier':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
          border: 'border-amber-300',
          titleBg: 'bg-amber-700',
          titleText: 'text-amber-50',
          highlight: 'bg-amber-600',
          shadow: '0 0 10px rgba(245, 158, 11, 0.3)',
          hoverShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22), 0 0 15px rgba(245, 158, 11, 0.4)',
          tokenBg: 'bg-amber-100',
          tokenBorder: 'border-amber-200',
          tokenText: 'text-amber-800',
          glowColor: 'rgba(245, 158, 11, 0.6)',
          glowColorStart: 'rgba(251, 191, 36, 0.8)',
          glowColorEnd: 'rgba(245, 158, 11, 0)'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-300',
          titleBg: 'bg-gray-700',
          titleText: 'text-gray-50',
          highlight: 'bg-gray-600',
          shadow: '0 0 10px rgba(107, 114, 128, 0.3)',
          hoverShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22), 0 0 15px rgba(107, 114, 128, 0.4)',
          tokenBg: 'bg-gray-100',
          tokenBorder: 'border-gray-200',
          tokenText: 'text-gray-800',
          glowColor: 'rgba(107, 114, 128, 0.6)',
          glowColorStart: 'rgba(156, 163, 175, 0.8)',
          glowColorEnd: 'rgba(107, 114, 128, 0)'
        };
    }
  };
  
  const colors = getCardColors();
  
  // Calculate fan position (if in hand tray)
  const calculateFanPosition = () => {
    if (totalCards <= 1) return {};
    
    // Calculate the angle based on position in the hand
    const middleIndex = (totalCards - 1) / 2;
    const offset = index - middleIndex;
    const maxRotation = Math.min(5, 25 / totalCards); // Limit rotation as cards increase
    const rotation = offset * maxRotation;
    
    // Calculate horizontal offset for fan effect
    const translateX = offset * Math.min(15, 120 / totalCards);
    
    return {
      rotate: rotation,
      translateX: translateX,
      originY: 1, // Bottom center pivot
    };
  };
  
  const fanPosition = calculateFanPosition();
  
  // Combine all style properties into a single object - using proper types for framer-motion
  const cardStyle = {
    width: '160px',
    height: '200px',
    boxShadow: isHovered ? colors.hoverShadow : colors.shadow,
    // Use proper CSS property naming for React/framer-motion
    transform: transform ? 
      `translate3d(${transform.x}px, ${transform.y}px, 0) ${isDragging ? 'rotate(4deg)' : ''}` : 
      undefined,
    zIndex: (transform || isHovered) ? 20 : index,
    transformOrigin: isInSlot ? 'center center' : 'bottom center',
    scale: scale,
    // Override boxShadow if transform exists
    ...(transform && { boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' })
  };

  // Additional styles that need to be applied with correct TypeScript types
  const additionalStyles: CSSProperties = {
    // Cast to 'preserve-3d' as the proper CSS value
    transformStyle: 'preserve-3d' as const,
    perspective: '1000px'
  };
  
  // Create dynamic 3D styles object for the inner card content
  const cardContentStyle = {
    rotateX: isInSlot ? 0 : rotateX,
    rotateY: isInSlot ? 0 : rotateY,
    scale: isHovered && !isDragging && !isInSlot ? 1.02 : 1,
  };
  
  // Don't make card draggable if it's in a slot (can still be dragged back to hand)
  const dragAttributes = isInSlot ? {} : { ...attributes, ...listeners };
  
  // Create dynamic gradient for glow effect based on mouse position
  const glowGradient = useTransform(
    [glowX, glowY], 
    ([latestX, latestY]) => 
      `radial-gradient(circle at ${latestX}% ${latestY}%, ${colors.glowColorStart}, ${colors.glowColorEnd} 70%)`
  );
  
  // Combine refs for drag-and-drop and mouse tracking
  const setRefs = (element: HTMLDivElement) => {
    setNodeRef(element);
    cardRef.current = element;
  };
  
  return (
    <motion.div
      ref={setRefs}
      style={cardStyle}
      className={`relative select-none rounded-lg overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: isDragging ? 1.1 * scale : scale, 
        opacity: 1, 
        y: 0,
        rotate: fanPosition.rotate || 0,
        x: fanPosition.translateX || 0,
        zIndex: isHovered ? 20 : index,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        scale: { duration: 0.2 }
      }}
      whileHover={!isDragging && !isInSlot ? { 
        scale: 1.08 * scale, 
        y: -10,
        zIndex: 20,
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...dragAttributes}
    >
      {/* Glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-lg -z-10 pointer-events-none"
        style={{ 
          opacity: isHovered ? 0.8 : 0,
          backgroundImage: glowGradient,
          filter: 'blur(20px)',
        }}
        transition={{ duration: 0.2 }}
      />
      
      <motion.div 
        style={{
          ...additionalStyles,
          ...cardContentStyle
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative h-full flex flex-col ${colors.bg} border ${colors.border} rounded-lg shadow-sm overflow-hidden`}
      >
        {/* Card decoration - top corner */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
          <div className={`absolute transform rotate-45 translate-x-6 -translate-y-6 w-12 h-12 ${colors.highlight} opacity-40`}></div>
        </div>
        
        {/* Card title */}
        <div 
          className={`p-2 ${colors.titleBg} ${colors.titleText} font-serif text-center font-bold tracking-wide text-sm`}
          style={{ transform: 'translateZ(6px)' }}
        >
          {card.title}
        </div>
        
        {/* Card content */}
        <div className="flex-grow p-3 flex flex-col justify-between" style={{ transform: 'translateZ(6px)' }}>
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
      </motion.div>
    </motion.div>
  );
};

export default PlayCard; 