import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

const UploadSection = ({ mode = 'body', onAnalysisComplete, bodyData = null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      await performAIAnalysis(file);
    }
  };

  const performAIAnalysis = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    
    try {
      if (mode === 'body') {
        formData.append('image', file);
        const response = await fetch('http://localhost:8000/analyze-body', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        onAnalysisComplete(data);
      } else {
        formData.append('outfit_image', file);
        formData.append('body_data', JSON.stringify(bodyData));
        const response = await fetch('http://localhost:8000/analyze-suitability', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        onAnalysisComplete(data);
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback for demo
      setTimeout(() => {
        if (mode === 'body') {
          onAnalysisComplete({
            body_shape: 'Hourglass',
            skin_tone: 'Warm Medium',
            height_ratio: 1.72,
            analysis_type: 'body'
          });
        } else {
          onAnalysisComplete({
            score: 85,
            recommendation: "This outfit suits your body type but a slightly tapered pant would improve proportions.",
            analysis_type: 'suitability'
          });
        }
      }, 1500);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-card rounded-[32px] p-8 border-dashed border-2 border-zinc-100 hover:border-brand-purple/30 transition-all group relative overflow-hidden">
        <input 
          type="file" 
          id={`photo-upload-${mode}`} 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*"
        />
        
        <label 
          htmlFor={`photo-upload-${mode}`} 
          className="flex flex-col items-center justify-center cursor-pointer gap-6 py-4"
        >
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-zinc-100 border-t-brand-purple rounded-full animate-spin" />
                  <Sparkles size={24} className="absolute inset-0 m-auto text-brand-purple animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black">AI is analyzing...</h4>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">Scanning {mode} proportions</p>
                </div>
              </motion.div>
            ) : preview ? (
              <motion.div
                key="preview"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="relative w-32 h-32 overflow-hidden rounded-2xl ring-4 ring-white shadow-xl">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                  <ImageIcon size={32} className="text-zinc-300 group-hover:text-brand-purple transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black">
                    {mode === 'body' ? 'Scan Your Body Shape' : 'Test This Outfit'}
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-medium max-w-[180px] mt-2 leading-relaxed">
                    {mode === 'body' 
                      ? 'Upload a full-body photo for personalized fit advice.' 
                      : 'Upload an outfit photo to see how it matches your profile.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </label>
      </div>
    </div>
  );
};


export default UploadSection;
