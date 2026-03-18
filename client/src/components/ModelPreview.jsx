import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserCheck } from 'lucide-react';

const ModelPreview = ({ gender, setGender, outfit }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Gender Toggle */}
      <div className="flex bg-zinc-100 p-1.5 rounded-full mb-12 shadow-inner border border-zinc-200/50">
        <button 
          onClick={() => setGender('male')}
          className={`flex items-center gap-2.5 px-8 py-3 rounded-full transition-all duration-300 ${
            gender === 'male' 
            ? 'bg-white text-brand-black shadow-lg scale-105' 
            : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <User size={16} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Male</span>
        </button>
        <button 
          onClick={() => setGender('female')}
          className={`flex items-center gap-2.5 px-8 py-3 rounded-full transition-all duration-300 ${
            gender === 'female' 
            ? 'bg-white text-brand-black shadow-lg scale-105' 
            : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <UserCheck size={16} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Female</span>
        </button>
      </div>

      {/* Avatar Container - INCREASED SIZE */}
      <div className="relative w-[320px] h-[560px] bg-white rounded-[48px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-white/50 mx-auto">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/[0.02] to-brand-purple/[0.02] pointer-events-none" />
        
        {/* Base Avatar Image */}
        <img 
          src={`/avatars/${gender}.png`} 
          alt={`${gender} Avatar`}
          className="absolute inset-0 w-full h-full object-contain z-[1] pointer-events-none scale-105" 
        />

        <AnimatePresence>
          {/* Bottom Layer */}
          {outfit.bottom && (
            <motion.div
              key={outfit.bottom.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[240px] left-0 w-full h-[240px] z-[2] transition-all"
            >
               <img 
                 src={outfit.bottom.image} 
                 alt={outfit.bottom.name}
                 className="w-full h-full object-contain mix-blend-multiply"
               />
            </motion.div>
          )}

          {/* Top Layer */}
          {outfit.top && (
            <motion.div
              key={outfit.top.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[100px] left-0 w-full h-[210px] z-[3] transition-all"
            >
               <img 
                 src={outfit.top.image} 
                 alt={outfit.top.name}
                 className="w-full h-full object-contain mix-blend-multiply"
               />
            </motion.div>
          )}

          {/* Outerwear Layer */}
          {outfit.jacket && (
            <motion.div
              key={outfit.jacket.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[95px] left-0 w-full h-[220px] z-[4] transition-all"
            >
               <img 
                 src={outfit.jacket.image} 
                 alt={outfit.jacket.name}
                 className="w-full h-full object-contain mix-blend-multiply"
               />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Labels Overlay */}
        <div className="absolute top-10 left-10 flex flex-col gap-2 z-10">
          <div className="px-2 py-1 bg-brand-black/5 rounded flex items-center gap-1 w-fit">
            <div className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">Live Preview</span>
          </div>
          <h4 className="text-xl font-sans font-bold text-brand-black leading-none capitalize">
             {gender} <span className="text-zinc-300 font-medium">Model</span>
          </h4>
        </div>
      </div>

      {/* Item Counter */}
      <div className="mt-10 flex items-center gap-3">
        <div className="h-[1px] w-8 bg-zinc-200" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
           {Object.values(outfit).filter(Boolean).length} / 5 Pieces Active
        </span>
        <div className="h-[1px] w-8 bg-zinc-200" />
      </div>
    </div>
  );
};


export default ModelPreview;
