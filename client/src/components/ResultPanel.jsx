import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, AlertCircle, TrendingUp, Palette, Ruler, XCircle, Lightbulb, Shirt } from 'lucide-react';

const ResultPanel = ({ result }) => {
  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto mt-20 space-y-12"
    >
      {/* Verdict Header */}
      <div className="text-center space-y-3 px-4">
        <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-purple">
          ✨ VIBE CHECK: {result.score}% MATCH
        </h2>
        <p className="text-lg text-zinc-600 font-bold italic">
          "{result.verdictLine}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Score chart and quick info */}
        <div className="md:col-span-5 space-y-8">
          
          <div className="glass-card p-10 flex flex-col items-center justify-center relative overflow-hidden group border-t-4 border-brand-pink/60">
            <div className="absolute inset-0 bg-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-xl">
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#F3F4F6" strokeWidth="12" />
                <motion.circle
                  cx="96" cy="96" r="88"
                  fill="transparent"
                  stroke="#FF3E6C"
                  strokeWidth="12"
                  strokeDasharray={552.92}
                  initial={{ strokeDashoffset: 552.92 }}
                  animate={{ strokeDashoffset: 552.92 - (552.92 * result.score) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-sans font-black text-brand-black">{result.score}%</span>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400 mt-1">Match Score</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-brand-black shadow-inner">
                <Ruler size={22} className="text-brand-purple" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Body Shape</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h4 className="text-lg font-sans font-bold text-brand-black capitalize">{result.bodyShape.name}</h4>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${result.bodyShape.confidence === 'High' ? 'bg-green-100 text-green-700' : result.bodyShape.confidence === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {result.bodyShape.confidence}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
              {result.bodyShape.why}
            </p>
          </div>

          <div className="glass-card p-6 flex items-center gap-4 relative">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-brand-black shadow-inner">
              <Palette size={22} className="text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Skin Tone</p>
              <h4 className="text-lg font-sans font-bold text-brand-black capitalize mt-0.5">{result.skinTone.monkScaleAndLabel}</h4>
              <p className="text-[10px] text-zinc-400 mt-1">Sampled from: <span className="font-bold">{result.skinTone.sampledFrom}</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Lists */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-card p-8 space-y-5">
            <h4 className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
              <Check size={18} /> What's Giving
            </h4>
            <ul className="space-y-3">
              {result.whatsGiving.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-zinc-700 font-medium leading-relaxed">
                  <span className="text-green-500 mt-0.5">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {result.whatsNotHitting && result.whatsNotHitting.length > 0 && result.whatsNotHitting[0] && (
            <div className="glass-card p-8 space-y-5">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-pink flex items-center gap-2">
                <XCircle size={18} /> What's Not Hitting
              </h4>
              <ul className="space-y-3">
                {result.whatsNotHitting.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-700 font-medium leading-relaxed">
                    <span className="text-brand-pink mt-0.5">▪</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="glass-card p-8 space-y-5 bg-gradient-to-br from-white to-brand-purple/5 border-brand-purple/20">
            <h4 className="text-sm font-black uppercase tracking-widest text-brand-purple flex items-center gap-2">
              <Lightbulb size={18} /> VibeFit Suggestions
            </h4>
            <ul className="space-y-3">
              {result.suggestions.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-zinc-800 font-bold leading-relaxed bg-white/50 p-3 rounded-xl">
                  <span className="text-brand-purple">💡</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 space-y-5">
            <h4 className="text-sm font-black uppercase tracking-widest text-brand-black flex items-center gap-2">
              <Shirt size={18} /> Outfits That Would Hit Harder
            </h4>
            <div className="flex flex-col gap-3">
              {result.betterOutfits.map((item, idx) => (
                <div key={idx} className="px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:border-brand-black transition-colors">
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ResultPanel;
