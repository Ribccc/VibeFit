import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategorySelector from './CategorySelector';
import ClothingCarousel from './ClothingCarousel';
import UploadSection from './UploadSection';
import StyleAnalysisCard from './StyleAnalysisCard';
import { Shuffle, RotateCcw, Check, User, Sparkles as SparkleIcon } from 'lucide-react';
import { clothingData } from '../data/clothes';

const OutfitStylistPanel = ({ 
  gender,
  currentOutfit, 
  setCurrentOutfit, 
  bodyData, 
  setBodyData, 
  suitabilityResult, 
  setSuitabilityResult 
}) => {

  const [activeCategory, setActiveCategory] = useState('Casual');

  const resetOutfit = () => {
    setCurrentOutfit({
      top: null,
      bottom: null,
      jacket: null,
      shoes: null,
      accessories: null
    });
    setSuitabilityResult(null);
  };

  const randomOutfit = () => {
    const categories = ['Tops', 'Bottoms', 'Jackets', 'Shoes'];
    const newOutfit = { ...currentOutfit };
    
    categories.forEach(cat => {
      const items = clothingData.filter(item => item.category === cat && item.gender === gender);
      if (items.length > 0) {
        newOutfit[cat.toLowerCase().replace('s', '')] = items[Math.floor(Math.random() * items.length)];
      }
    });
    
    setCurrentOutfit(newOutfit);
    setSuitabilityResult(null);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* AI Analysis Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center text-white">
            <SparkleIcon size={18} />
          </div>
          <h3 className="text-xl font-sans font-bold">AI Stylist Pro</h3>
        </div>

        {!bodyData ? (
          <UploadSection mode="body" onAnalysisComplete={setBodyData} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <StyleAnalysisCard result={bodyData} />
            
            {!suitabilityResult ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-brand-purple" />
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Test Your Fit</span>
                </div>
                <UploadSection 
                  mode="suitability" 
                  bodyData={bodyData} 
                  onAnalysisComplete={setSuitabilityResult} 
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <StyleAnalysisCard result={suitabilityResult} />
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* Manual Selection Section */}
      <section className="pt-8 border-t border-zinc-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-sans font-bold">Manual Curation</h3>
          <div className="flex gap-2">
             <button 
              onClick={randomOutfit}
              className="p-2.5 rounded-full bg-zinc-50 text-zinc-400 hover:text-brand-black hover:bg-zinc-100 transition-all"
              title="Random Mix"
            >
              <Shuffle size={16} />
            </button>
            <button 
              onClick={resetOutfit}
              className="p-2.5 rounded-full bg-zinc-50 text-zinc-400 hover:text-brand-pink hover:bg-brand-pink/5 transition-all"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-12">
          <ClothingCarousel 
            title="Essential Tops" 
            items={clothingData.filter(i => i.category === 'Tops' && i.gender === gender)} 
            onSelect={(item) => setCurrentOutfit(prev => ({ ...prev, top: item }))}
            selectedId={currentOutfit.top?.id}
          />
          <ClothingCarousel 
            title="Premium Bottoms" 
            items={clothingData.filter(i => i.category === 'Bottoms' && i.gender === gender)} 
            onSelect={(item) => setCurrentOutfit(prev => ({ ...prev, bottom: item }))}
            selectedId={currentOutfit.bottom?.id}
          />
          <ClothingCarousel 
            title="Modern Jackets" 
            items={clothingData.filter(i => i.category === 'Jackets' && i.gender === gender)} 
            onSelect={(item) => setCurrentOutfit(prev => ({ ...prev, jacket: item }))}
            selectedId={currentOutfit.jacket?.id}
          />
          <ClothingCarousel 
            title="Footer Selection" 
            items={clothingData.filter(i => i.category === 'Shoes' && i.gender === gender)} 
            onSelect={(item) => setCurrentOutfit(prev => ({ ...prev, shoes: item }))}
            selectedId={currentOutfit.shoes?.id}
          />
        </div>
      </section>


      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-brand-black text-white px-8 py-4 rounded-full flex items-center gap-8 shadow-2xl z-[100] backdrop-blur-xl border border-white/10"
      >
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Items</span>
          <span className="text-sm font-bold">
            {Object.values(currentOutfit).filter(Boolean).length} Selected
          </span>
        </div>
        <div className="h-8 w-[1px] bg-white/10" />
        <button className="flex items-center gap-2 text-sm font-bold hover:text-brand-pink transition-colors">
          <Check size={18} /> Complete Fit
        </button>
      </motion.div>
    </div>
  );
};


export default OutfitStylistPanel;
