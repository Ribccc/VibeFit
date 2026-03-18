import React from 'react';
import StyleScoreChart from './StyleScoreChart';
import { Sparkles, Palette } from 'lucide-react';

const StyleAnalysisCard = ({ result }) => {
  const isSuitability = result.analysis_type === 'suitability';

  return (
    <div className="glass-card rounded-[40px] p-10 relative overflow-hidden border-t-4 border-brand-pink/20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-10">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/5 rounded-full">
            <Sparkles size={14} className="text-brand-pink" />
            <span className="text-[10px] font-bold text-brand-pink uppercase tracking-widest">AI Report</span>
          </div>
          <h3 className="text-3xl font-sans font-bold leading-tight">
            {isSuitability ? 'Outfit Suitability' : 'Body Analysis'}
          </h3>
          <p className="text-sm text-zinc-500 font-medium">
            {isSuitability 
              ? 'Compatibility between your profile and selected piece.' 
              : 'Detailed scan of your body geometric proportions.'}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-brand-pink/5 rounded-full blur-xl group-hover:bg-brand-pink/10 transition-all" />
          <StyleScoreChart score={isSuitability ? result.score : result.height_ratio * 50} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!isSuitability ? (
          <>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
                  <User size={12} /> Body Geometry
                </span>
                <span className="text-xl font-sans font-bold text-brand-black capitalize">{result.body_shape}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
                  <Palette size={12} /> Tone Match
                </span>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full border-4 border-white shadow-lg ring-1 ring-zinc-100"
                    style={{ backgroundColor: result.skin_tone.includes('Warm') ? '#F5C6A5' : result.skin_tone.includes('Deep') ? '#4B3621' : '#F7E2D6' }}
                  />
                  <span className="text-sm font-bold text-zinc-700">{result.skin_tone}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100 group hover:bg-zinc-50 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Pro-Tips</span>
              <p className="text-xs font-medium text-zinc-600 mt-4 leading-relaxed">
                Your <span className="text-brand-black font-bold">{result.body_shape}</span> shape is most flattered by items that {result.body_shape === 'hourglass' ? 'accentuate your waistline.' : 'add structure to your upper frame.'} 
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-full space-y-6">
              <div className="bg-brand-black p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Suitability Verdict</span>
                <p className="text-sm font-medium mt-4 leading-relaxed relative z-10 italic">
                  "{result.recommendation}"
                </p>
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 bg-brand-pink text-white py-3 rounded-full text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                    Keep This Outfit
                  </button>
                  <button className="flex-1 border border-zinc-700 text-zinc-300 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors">
                    Try Better Style
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default StyleAnalysisCard;
