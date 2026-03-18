import React from 'react';

const categories = ['Casual', 'Streetwear', 'Formal', 'Techwear'];

const CategorySelector = ({ active, setActive }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide transition-all whitespace-nowrap
            ${active === cat 
              ? 'bg-brand-black text-white shadow-lg shadow-zinc-200 scale-105' 
              : 'bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-200'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};


export default CategorySelector;
