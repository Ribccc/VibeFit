import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Camera, Sparkles, ArrowRight, AlertCircle,
  RefreshCw, Ruler, ChevronRight, Zap, Star, TrendingUp
} from 'lucide-react';

// ── UPLOAD CARD ──────────────────────────────────────────────────────────────
const UploadCard = ({ title, description, image, onImageUpload, onClear, type }) => {
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    onImageUpload(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div className="glass-card p-5 flex flex-col gap-4 w-full transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-brand-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5">{description}</p>
        </div>
        {image && (
          <button onClick={onClear}
            className="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-red-50 hover:text-red-400 flex items-center justify-center text-zinc-400 transition-all duration-200">
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div
        onClick={() => !image && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`relative w-full aspect-[4/5] rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center
          ${image ? 'border-transparent' : isDragging
            ? 'border-brand-pink bg-brand-pink/5 scale-[1.01]'
            : 'border-dashed border-zinc-200 bg-zinc-50/60 hover:border-brand-purple/40 hover:bg-brand-purple/[0.02]'
          }`}
      >
        <AnimatePresence mode="wait">
          {image ? (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-brand-pink transition-all shadow-lg"
              >Change Photo</button>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 p-6 text-center group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-brand-pink text-white scale-110' : 'bg-gradient-to-br from-zinc-50 to-zinc-100 text-zinc-300 border border-zinc-200'}`}>
                {type === 'person' ? <Camera size={26} /> : <Upload size={26} />}
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-500">
                  {isDragging ? 'Drop it! 🎯' : type === 'person' ? 'Upload your photo' : 'Upload outfit photo'}
                </p>
                <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest mt-1">or click to browse</p>
              </div>
              <p className="text-[10px] text-zinc-300 font-medium">JPG, PNG, WebP — max 10MB</p>
            </motion.div>
          )}
        </AnimatePresence>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      </div>
    </div>
  );
};

// ── LOADING STATE ─────────────────────────────────────────────────────────────
const STAGES = [
  { label: 'Scanning body proportions...', icon: '📐' },
  { label: 'Reading your skin tone...', icon: '🎨' },
  { label: 'Analysing outfit details...', icon: '👗' },
  { label: 'Calculating vibe score...', icon: '✨' },
];

const LoadingState = ({ stage }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center gap-8 py-24"
  >
    <div className="relative">
      <div className="w-28 h-28 rounded-full border-[3px] border-zinc-100 border-t-brand-pink animate-spin" style={{ borderTopColor: '#FF2D6B' }} />
      <div className="w-28 h-28 rounded-full border-[3px] border-transparent border-r-brand-purple/30 animate-spin absolute inset-0" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      <div className="absolute inset-0 flex items-center justify-center text-4xl">{STAGES[stage]?.icon || '✨'}</div>
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-bold text-brand-black" style={{ fontFamily: "'Clash Display', sans-serif" }}>Vibe checking your fit...</h3>
      <p className="text-sm text-zinc-500 font-medium">{STAGES[stage]?.label}</p>
    </div>
    <div className="flex gap-2">
      {STAGES.map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= stage ? 'w-10' : 'w-4 bg-zinc-200'}`}
          style={i <= stage ? { background: 'linear-gradient(90deg,#FF2D6B,#7B2FFF)', width: '40px' } : {}} />
      ))}
    </div>
  </motion.div>
);

// ── SCORE RING ────────────────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const r = 88;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#00E5A0' : score >= 50 ? '#FFB800' : '#FF2D6B';
  const label = score >= 75 ? 'Great Match!' : score >= 50 ? 'Decent Fit' : 'Needs Work';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90 drop-shadow-sm">
          <circle cx="96" cy="96" r={r} fill="transparent" stroke="#F0EDF8" strokeWidth="14" />
          <motion.circle
            cx="96" cy="96" r={r} fill="transparent"
            stroke={color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (circ * score) / 100 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-black text-brand-black"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >{score}%</motion.span>
          <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Match Score</span>
        </div>
      </div>
      <span style={{ color }} className="text-sm font-black uppercase tracking-widest">{label}</span>
    </div>
  );
};

// ── SCORE BAR ─────────────────────────────────────────────────────────────────
const ScoreBar = ({ label, value, max }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-zinc-500">{label}</span>
        <span className="text-[11px] font-black text-brand-black">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #FF2D6B, #7B2FFF)' }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ── BODY TYPE RESULT CARD ─────────────────────────────────────────────────────
const BodyTypeResult = ({ data, onClose }) => {
  if (!data) return null;
  const { bodyShape, styleTips = [] } = data;
  const confColor = {
    High:   { bg: 'rgba(0,229,160,0.15)', text: '#00E5A0' },
    Medium: { bg: 'rgba(255,184,0,0.15)',  text: '#FFB800' },
    Low:    { bg: 'rgba(255,45,107,0.15)', text: '#FF2D6B' },
  };
  const conf = confColor[bodyShape?.confidence] || confColor.Medium;

  const shapeEmoji = {
    'HOURGLASS':          '⏳',
    'RECTANGLE':          '▬',
    'RECTANGLE/COLUMN':   '▬',
    'PEAR/TRIANGLE':      '🍐',
    'INVERTED TRIANGLE':  '🔺',
    'APPLE/ROUND':        '🍎',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="body-type-card p-8 w-full max-w-3xl mx-auto relative"
    >
      {/* Close */}
      <button onClick={onClose}
        className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all z-10">
        <X size={16} />
      </button>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: 'rgba(123,47,255,0.2)', border: '1px solid rgba(123,47,255,0.3)' }}>
            {shapeEmoji[bodyShape?.name?.toUpperCase()] || '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Your Body Type</span>
            </div>
            <h3 className="text-3xl font-bold text-white leading-tight mb-2"
              style={{ fontFamily: "'Clash Display', sans-serif" }}>
              {bodyShape?.name}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: conf.bg, color: conf.text }}>
              {bodyShape?.confidence} Confidence
            </span>
          </div>
        </div>

        {/* Why explanation */}
        {bodyShape?.why && (
          <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">{bodyShape.why}</p>
          </div>
        )}

        {/* Ratios */}
        {bodyShape?.ratios && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Shoulder/Hip', val: bodyShape.ratios.shoulderToHip },
              { label: 'Waist/Hip',    val: bodyShape.ratios.waistToHip },
              { label: 'Waist/Shoulder', val: bodyShape.ratios.waistToShoulder },
            ].map(({ label, val }) => val != null && (
              <div key={label} className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
                <p className="text-lg font-black text-white">{Number(val).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Style Tips */}
        {styleTips.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 flex items-center gap-1.5">
              <Zap size={10} /> Style Tips for Your Shape
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {styleTips.map((tip, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-black mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#FF2D6B,#7B2FFF)', color: 'white' }}>
                    {i + 1}
                  </span>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── RESULT PANEL ──────────────────────────────────────────────────────────────
const ResultPanel = ({ result }) => {
  if (!result) return null;
  const { score, verdictLine, bodyShape, skinTone, outfitBreakdown, scoreBreakdown,
    whatsGiving = [], whatsNotHitting = [], suggestions = [], betterOutfits = [] } = result;
  const confColor = { High: 'badge-green', Medium: 'badge-orange', Low: 'badge-red' };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto mt-16 space-y-6">

      {/* ── HERO VERDICT ── */}
      <div className="glass-card p-10 text-center space-y-3 bg-gradient-vibe border-brand-pink/10">
        <div className="badge badge-pink mx-auto"><Sparkles size={10} /> VibeFit Report</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient leading-tight"
          style={{ fontFamily: "'Clash Display', sans-serif" }}>
          ✨ VIBE CHECK: {score}% MATCH
        </h2>
        <p className="text-lg text-zinc-500 font-semibold italic max-w-xl mx-auto">"{verdictLine}"</p>
      </div>

      {/* ── SCORE + BODY + SKIN ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-8 flex items-center justify-center border border-zinc-100">
          <ScoreRing score={score} />
        </div>

        <div className="glass-card p-7 flex flex-col gap-4 border border-zinc-100">
          <div className="section-label flex items-center gap-1.5">📐 Body Shape</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-brand-black" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {bodyShape?.name}
              </span>
              {bodyShape?.confidence && (
                <span className={`badge ${confColor[bodyShape.confidence] || 'badge-orange'}`}>
                  {bodyShape.confidence} Confidence
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">{bodyShape?.why}</p>
          </div>
        </div>

        <div className="glass-card p-7 flex flex-col gap-4 border border-zinc-100">
          <div className="section-label">🎨 Skin Tone</div>
          <div className="space-y-2">
            <span className="text-2xl font-bold text-brand-black" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              {skinTone?.monkScaleAndLabel}
            </span>
            <p className="text-xs text-zinc-400 font-medium">
              Sampled: <span className="text-zinc-600 font-bold">{skinTone?.sampledFrom}</span>
            </p>
          </div>
          {scoreBreakdown && (
            <div className="mt-auto pt-4 border-t border-zinc-100 space-y-3">
              <ScoreBar label="Proportion Balance" value={scoreBreakdown.proportionBalance} max={40} />
              <ScoreBar label="Color Harmony"      value={scoreBreakdown.colorHarmony}      max={25} />
              <ScoreBar label="Structure & Fit"    value={scoreBreakdown.structureAndFit}   max={20} />
              <ScoreBar label="Style Cohesion"     value={scoreBreakdown.styleCohesion}     max={15} />
            </div>
          )}
        </div>
      </div>

      {/* ── OUTFIT BREAKDOWN ── */}
      {outfitBreakdown && (
        <div className="glass-card p-7 border border-zinc-100">
          <h4 className="section-label mb-5">👗 Outfit Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Silhouette', val: outfitBreakdown.silhouette },
              { label: 'Neckline',   val: outfitBreakdown.neckline },
              { label: 'Waist',      val: outfitBreakdown.waistDefinition },
              { label: 'Hemline',    val: outfitBreakdown.hemline },
              { label: 'Colors',     val: outfitBreakdown.colorsAndPrint },
            ].map(({ label, val }) => val && (
              <div key={label} className="bg-zinc-50/80 rounded-2xl p-4 space-y-1.5 border border-zinc-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                <p className="text-xs font-bold text-brand-black leading-snug">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── WHAT'S GIVING / NOT HITTING ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-card p-7 space-y-4 border border-emerald-100/60">
          <h4 className="section-label text-emerald-600 flex items-center gap-1.5">✅ What's Giving</h4>
          <ul className="space-y-3">
            {whatsGiving.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-emerald-400 mt-0.5 shrink-0 font-black">✦</span>
                <span className="text-sm text-zinc-700 font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-7 space-y-4 border border-red-100/60">
          <h4 className="section-label text-brand-pink flex items-center gap-1.5">❌ What's Not Hitting</h4>
          <ul className="space-y-3">
            {whatsNotHitting.filter(Boolean).map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-brand-pink mt-0.5 shrink-0 font-black">▪</span>
                <span className="text-sm text-zinc-700 font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── SUGGESTIONS ── */}
      <div className="glass-card-violet p-7 space-y-5">
        <h4 className="section-label text-brand-purple flex items-center gap-1.5"><Zap size={10} /> VibeFit Suggestions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((tip, i) => (
            <div key={i} className="bg-white/60 rounded-2xl p-5 border border-white/80 space-y-2.5 hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg,#FF2D6B20,#7B2FFF20)' }}>
                {['💡', '✂️', '🎨'][i] || '💡'}
              </div>
              <p className="text-xs font-semibold text-zinc-800 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BETTER OUTFITS ── */}
      <div className="glass-card-dark p-7 space-y-5">
        <h4 className="section-label text-zinc-400 flex items-center gap-1.5"><TrendingUp size={10} /> Outfits That Would Hit Harder</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {betterOutfits.map((outfit, i) => (
            <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/8 rounded-2xl p-5 transition-all duration-200 group cursor-default"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <span className="text-2xl">{['🔥', '✨', '💫'][i] || '👗'}</span>
              <p className="text-sm font-medium text-zinc-400 mt-3 leading-relaxed group-hover:text-white transition-colors">{outfit}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [userImage,       setUserImage]       = useState(null);
  const [outfitImage,     setOutfitImage]     = useState(null);
  const [analysisResult,  setAnalysisResult]  = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [loadingStage,    setLoadingStage]    = useState(0);
  const [error,           setError]           = useState(null);

  // Measurements
  const [shoulder, setShoulder] = useState('');
  const [waist,    setWaist]    = useState('');
  const [hips,     setHips]     = useState('');
  const [height,   setHeight]   = useState('');

  // Body type from measurements
  const [bodyTypeResult,  setBodyTypeResult]  = useState(null);
  const [bodyTypeLoading, setBodyTypeLoading] = useState(false);
  const [bodyTypeError,   setBodyTypeError]   = useState(null);

  const reset = () => {
    setUserImage(null); setOutfitImage(null);
    setAnalysisResult(null); setError(null);
    setBodyTypeResult(null); setBodyTypeError(null);
  };

  // ── Generate body type from measurements only ──
  const handleGenerateBodyType = async () => {
    const provided = [shoulder, waist, hips].filter(v => v.trim());
    if (provided.length < 2) {
      setBodyTypeError('Please fill in at least 2 measurements (shoulder, waist, or hips) to generate your body type.');
      return;
    }
    setBodyTypeLoading(true);
    setBodyTypeError(null);
    setBodyTypeResult(null);

    const form = new FormData();
    if (shoulder) form.append('shoulder', shoulder);
    if (waist)    form.append('waist',    waist);
    if (hips)     form.append('hips',     hips);
    if (height)   form.append('height',   height);

    try {
      const res = await fetch('/api/analyze-body-type', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setBodyTypeResult(await res.json());
    } catch (err) {
      setBodyTypeError(err.message || 'Could not generate body type. Please try again.');
    } finally {
      setBodyTypeLoading(false);
    }
  };

  // ── Full style analysis ──
  const handleAnalyze = async () => {
    if (!userImage || !outfitImage) return;
    setLoading(true); setError(null); setAnalysisResult(null); setLoadingStage(0);
    const stageTimer = setInterval(() => setLoadingStage(s => Math.min(s + 1, STAGES.length - 1)), 2500);

    const formData = new FormData();
    formData.append('user_photo',   userImage);
    formData.append('outfit_photo', outfitImage);
    if (shoulder) formData.append('shoulder', shoulder);
    if (waist)    formData.append('waist',    waist);
    if (hips)     formData.append('hips',     hips);

    try {
      const res = await fetch('/api/analyze-style', { method: 'POST', body: formData });
      clearInterval(stageTimer);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setAnalysisResult(await res.json());
    } catch (err) {
      clearInterval(stageTimer);
      setError(err.message || 'Something went wrong. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const canGenerateBodyType = [shoulder, waist, hips].filter(v => v.trim()).length >= 2;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F7F6F3', color: '#0F0F13' }}>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-zinc-100/80 flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 group-hover:scale-105 transition-all duration-500"
            style={{ background: 'linear-gradient(135deg,#FF2D6B,#7B2FFF)', boxShadow: '0 4px 16px rgba(255,45,107,0.35)' }}>
            <Sparkles size={17} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Vibe<span style={{ color: '#FF2D6B' }}>Fit</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-pink transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-pink hover:after:w-full after:transition-all">How It Works</a>
          <a href="#" className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-pink transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-pink hover:after:w-full after:transition-all">Trends</a>
          {analysisResult && (
            <button onClick={reset} className="btn-ghost py-2 px-5 text-[11px] flex items-center gap-1.5">
              <RefreshCw size={12} /> Start Over
            </button>
          )}
          {!analysisResult && userImage && outfitImage && (
            <button onClick={handleAnalyze} disabled={loading} className="btn-primary py-2.5 px-6 text-[11px]">
              Analyze Fit
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 md:px-8 pt-28">

        {/* ── HERO ── */}
        <AnimatePresence>
          {!analysisResult && !loading && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-5 mb-14 relative">

              {/* Decorative blobs */}
              <div className="hero-blob w-72 h-72 -top-20 -left-32 hidden lg:block"
                style={{ background: 'radial-gradient(circle, rgba(255,45,107,0.2) 0%, transparent 70%)' }} />
              <div className="hero-blob w-64 h-64 -top-10 -right-24 hidden lg:block"
                style={{ background: 'radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%)', animationDelay: '1.5s' }} />

              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
                className="badge badge-pink mx-auto relative z-10">
                <Sparkles size={10} /> Powered by VibeFit AI
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] relative z-10"
                style={{ fontFamily: "'Clash Display', sans-serif" }}>
                Your Style,<br />
                <span className="text-gradient">AI-Perfected.</span>
              </h1>

              <p className="text-zinc-500 font-medium max-w-md mx-auto leading-relaxed text-base relative z-10">
                Upload your photo + an outfit for an honest AI vibe check — or just enter your measurements to discover your body type instantly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT (hide after result) ── */}
        <AnimatePresence>
          {!analysisResult && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* ── MEASUREMENTS + BODY TYPE ── */}
              <div className="glass-card p-6 border border-zinc-100/80 max-w-3xl mx-auto">
                <div className="flex flex-col gap-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-brand-black flex items-center gap-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <Ruler size={15} className="text-brand-purple" />
                        Measurements
                        <span className="badge badge-purple">Boosts Accuracy</span>
                      </p>
                      <p className="text-[11px] text-zinc-400 font-medium mt-1">
                        Enter in cm. Minimum 2 measurements to generate body type.
                      </p>
                    </div>
                  </div>

                  {/* Input row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { placeholder: 'Shoulder', value: shoulder, set: setShoulder },
                      { placeholder: 'Waist',    value: waist,    set: setWaist },
                      { placeholder: 'Hips',     value: hips,     set: setHips },
                      { placeholder: 'Height',   value: height,   set: setHeight },
                    ].map(({ placeholder, value, set }) => (
                      <div key={placeholder} className="relative">
                        <input
                          className="input-elegant w-full pr-10"
                          placeholder={placeholder}
                          value={value}
                          onChange={e => set(e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">cm</span>
                      </div>
                    ))}
                  </div>

                  {/* Generate button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      onClick={handleGenerateBodyType}
                      disabled={!canGenerateBodyType || bodyTypeLoading}
                      className="btn-violet flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {bodyTypeLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Star size={14} />
                          Generate Body Type
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                    {!canGenerateBodyType && (
                      <p className="text-[11px] text-zinc-400 font-medium">Fill in at least 2 measurements above ↑</p>
                    )}
                  </div>

                  {/* Body type error */}
                  <AnimatePresence>
                    {bodyTypeError && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-500 font-medium">{bodyTypeError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── BODY TYPE RESULT ── */}
              <AnimatePresence>
                {bodyTypeResult && (
                  <BodyTypeResult data={bodyTypeResult} onClose={() => setBodyTypeResult(null)} />
                )}
              </AnimatePresence>

              {/* ── DIVIDER ── */}
              <div className="flex items-center gap-4 max-w-3xl mx-auto">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">+ or upload photos</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              {/* ── UPLOAD GRID ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                <UploadCard title="Your Photo" description="Full body · clear lighting" image={userImage} onImageUpload={setUserImage} onClear={() => setUserImage(null)} type="person" />
                <UploadCard title="Outfit Photo" description="Clean view of the look" image={outfitImage} onImageUpload={setOutfitImage} onClear={() => setOutfitImage(null)} type="outfit" />
              </div>

              {/* ── CTA ── */}
              <AnimatePresence>
                {userImage && outfitImage && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-4">
                    <button onClick={handleAnalyze}
                      className="btn-primary text-base py-5 px-14 flex items-center gap-3 animate-glow">
                      <Sparkles size={17} />
                      Get My Vibe Check
                      <ArrowRight size={17} />
                    </button>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Powered by Groq Vision AI</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOADING ── */}
        <AnimatePresence>
          {loading && <LoadingState stage={loadingStage} />}
        </AnimatePresence>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="max-w-lg mx-auto mt-10 p-5 glass-card border border-red-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-500">{error}</p>
                <button onClick={handleAnalyze} className="text-[11px] font-bold text-zinc-400 hover:text-brand-pink mt-1 transition-colors flex items-center gap-1">
                  <RefreshCw size={10} /> Try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULT ── */}
        <ResultPanel result={analysisResult} />

        {/* ── RESET ── */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
              <button onClick={reset} className="btn-ghost flex items-center gap-2">
                <RefreshCw size={14} /> Analyze Another Outfit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
