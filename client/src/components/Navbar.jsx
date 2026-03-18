import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Navbar = ({ onAction }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-20 bg-white/70 backdrop-blur-3xl border-b border-zinc-100/50 flex items-center justify-between px-8 md:px-12">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-10 h-10 bg-brand-pink rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-pink/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
          <Sparkles size={22} fill="currentColor" />
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-sans font-bold tracking-tighter text-brand-black">Vibe</span>
          <span className="text-2xl font-sans font-bold tracking-tighter text-brand-pink">Fit</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-brand-pink transition-colors">How it works</a>
        <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-brand-pink transition-colors">Trends</a>
        <div className="h-4 w-[1px] bg-zinc-200 mx-2" />
        <button onClick={onAction} className="btn-primary py-2.5 px-6 text-[11px]">Analyze Fit</button>
      </div>


      {/* Mobile Menu Icon */}
      <div className="md:hidden w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
        <div className="w-5 h-0.5 bg-brand-black rounded-full" />
      </div>
    </nav>
  );
};



export default Navbar;
