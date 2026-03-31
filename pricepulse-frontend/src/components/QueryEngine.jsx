import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Loader2, Tag } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const QueryEngine = () => {
  const { searchId, setSearchId, fetchAnalytics, isSearching, analytics } = usePrice();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0f1115] border border-slate-200/60 dark:border-white/5 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden group transition-colors duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-2">
          <Search size={14} className="text-cyan-500" /> Query Engine
        </h3>

        <form onSubmit={fetchAnalytics} className="relative">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search Product ID..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-2xl py-4 pl-5 pr-14 outline-none text-sm font-medium text-slate-900 placeholder-slate-400 dark:bg-[#161920] dark:border-white/5 dark:focus:border-cyan-500/50 dark:text-white dark:placeholder-slate-600 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
          >
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={2.5} />}
          </button>
        </form>
      </div>

      {analytics && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-3xl p-5 shadow-sm relative overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1 flex items-center gap-1.5"><Tag size={10} /> Active Product:</p>
              <p className="font-bold text-slate-800 dark:text-white text-sm truncate pr-2">{analytics.product_name} <span className="text-slate-500 font-mono text-[10px] ml-1">#{analytics.product_id || searchId}</span></p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 px-3 py-1.5 rounded-full text-cyan-700 dark:text-cyan-400 text-[9px] font-black uppercase tracking-widest truncate max-w-[100px] flex-shrink-0 text-center">
              {analytics.category || 'General'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QueryEngine;
