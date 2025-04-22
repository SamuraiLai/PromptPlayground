import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Howl } from "howler";

interface GateIntroProps {
  onOpen: () => void;
}

export default function GateIntro({ onOpen }: GateIntroProps) {
  const [open, setOpen] = useState(false);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const [gateSound, setGateSound] = useState<Howl | null>(null);

  // Initialize sound
  useEffect(() => {
    const sound = new Howl({ 
      src: ['/sounds/chain_open.mp3'], 
      volume: 0.7,
      onload: () => setSoundLoaded(true),
      onloaderror: (id, error) => console.error("Error loading sound:", error)
    });
    setGateSound(sound);

    return () => {
      if (sound) sound.unload();
    };
  }, []);
  
  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Skip intro on Enter key press
      if (event.key === 'Enter' && !open) {
        handleOpen();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    
    if (gateSound && soundLoaded) {
      gateSound.play();
    }
    
    // Give time for animation + sound to finish
    setTimeout(onOpen, 2200);
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Guild emblem background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 rounded-full bg-amber-900/20 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border border-amber-800/30 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-amber-700/10 to-amber-900/10 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Wood texture overlay */}
      <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-20 mix-blend-overlay"></div>
      
      {/* Left Gate Panel */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: open ? "-100%" : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-green-950 to-green-900 shadow-2xl z-10 border-r border-amber-900/40 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="w-8 h-32 bg-amber-900/60 rounded-full flex items-center justify-center border-r border-amber-700/60">
            <div className="w-3 h-3 bg-amber-400/70 rounded-full shadow-amber-300 shadow-sm"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Right Gate Panel */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: open ? "100%" : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-green-950 to-green-900 shadow-2xl z-10 border-l border-amber-900/40 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="w-8 h-32 bg-amber-900/60 rounded-full flex items-center justify-center border-l border-amber-700/60">
            <div className="w-3 h-3 bg-amber-400/70 rounded-full shadow-amber-300 shadow-sm"></div>
          </div>
        </div>
      </motion.div>

      {/* Guild Name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none">
        <motion.h1 
          className="text-5xl md:text-7xl font-serif text-amber-100 tracking-wide drop-shadow-lg text-center px-4"
          animate={{ 
            opacity: open ? 0 : 1,
            scale: open ? 1.2 : 1,
            y: open ? -20 : 0
          }}
          transition={{ duration: 1.5 }}
        >
          Promptcraft Guild
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-amber-200/70 mt-4 font-serif italic max-w-md text-center px-6"
          animate={{ 
            opacity: open ? 0 : 1,
            y: open ? 20 : 0
          }}
          transition={{ duration: 1.5 }}
        >
          Where the arcane art of prompting is crafted and mastered
        </motion.p>
      </div>

      {/* Buttons */}
      {!open && (
        <motion.div 
          className="absolute bottom-16 w-full flex flex-col items-center gap-4 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={handleOpen}
              className="bg-amber-700 hover:bg-amber-600 text-amber-100 font-serif py-3 px-8 rounded-lg shadow-lg border border-amber-600/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">▶</span> Enter the Guild
            </motion.button>
            <motion.button
              onClick={() => alert("Coming soon...")}
              className="bg-indigo-800/70 hover:bg-indigo-700/90 text-indigo-100 font-serif py-3 px-8 rounded-lg shadow-lg border border-indigo-600/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.7)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">👁</span> Watch a Master
            </motion.button>
          </div>
          
          <motion.p
            className="text-amber-200/60 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Press <span className="px-2 py-1 bg-black/20 rounded border border-amber-900/20 text-amber-300 mx-1">Enter</span> to skip
          </motion.p>
        </motion.div>
      )}
    </div>
  );
} 