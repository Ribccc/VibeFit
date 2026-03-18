import React, { useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadCard = ({ title, description, image, onImageUpload, onClear, type }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="glass-card p-10 flex flex-col items-center gap-8 w-full max-w-md transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-sans font-bold text-brand-black">{title}</h3>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{description}</p>
      </div>

      <div 
        onClick={() => !image && fileInputRef.current?.click()}
        className={`relative w-full aspect-[4/5] rounded-[48px] border-2 border-dashed transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4
          ${image 
            ? 'border-transparent bg-white shadow-inner' 
            : 'border-zinc-200 bg-white hover:border-brand-pink/50 hover:bg-brand-pink/[0.02] group'}`}
      >
        {image ? (
          <>
            <img 
              src={URL.createObjectURL(image)} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-[40px] shadow-2xl"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-zinc-500 hover:text-brand-pink hover:scale-110 active:scale-95 transition-all shadow-xl z-20"
            >
              <X size={20} strokeWidth={3} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-brand-pink hover:scale-105 active:scale-95 transition-all shadow-xl z-20 border border-white/50"
            >
              Change Image
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/20 to-transparent pointer-events-none" />

          </>
        ) : (
          <div className="flex flex-col items-center gap-6 group-hover:scale-110 transition-transform duration-500">
            <div className="w-20 h-20 bg-zinc-50 rounded-[32px] flex items-center justify-center text-zinc-300 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-all duration-500">
              {type === 'person' ? <Camera size={40} /> : <Upload size={40} />}
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-zinc-500">Drop image here</span>
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">or click to browse</span>
            </div>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UploadCard;
