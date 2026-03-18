import React from 'react';
import { motion } from 'framer-motion';

const ClothingCarousel = ({ title, items, onSelect, selectedId }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{title}</h4>
        <span className="text-xs font-semibold text-zinc-400">{items.length} items</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item)}
            className={`flex-shrink-0 w-32 aspect-square glass-card rounded-2xl flex flex-col items-center justify-center gap-2 p-3 transition-all ${
              selectedId === item.id 
              ? 'ring-2 ring-accent-pink bg-pink-50/30' 
              : 'hover:border-accent-pink/50'
            }`}
          >
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
              {item.image.startsWith('/') ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain mix-blend-multiply" 
                />
              ) : (
                <span className="text-4xl">{item.image}</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-zinc-600 line-clamp-1 text-center">

              {item.name}
            </span>
            <div className={`w-2 h-2 rounded-full ${selectedId === item.id ? 'bg-accent-pink' : 'bg-transparent'}`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ClothingCarousel;
