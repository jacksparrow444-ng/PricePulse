import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Loader2, Tag, History, ChevronRight } from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import axios from 'axios';

const QueryEngine = () => {
  const { searchId, setSearchId, fetchAnalytics, isSearching, analytics, recentSearches, IMAGE_BASE } = usePrice();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSugg = async () => {
      if (!searchId || searchId.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`${IMAGE_BASE}/api/suggestions?q=${searchId}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch suggestions");
      }
    };
    
    const debounceTimer = setTimeout(fetchSugg, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchId, IMAGE_BASE]);

  const handleSuggestionClick = (id) => {
    setSearchId(id.toString());
    setShowSuggestions(false);
    fetchAnalytics(null, id.toString());
  };

  return (
    <div className="space-y-6 relative z-50">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-white/90 dark:bg-[#0a0c10]/80 backdrop-blur-2xl border border-cyan-400/40 dark:border-cyan-500/30 rounded-[2rem] p-6 shadow-[0_0_40px_rgba(6,182,212,0.2)] dark:shadow-[0_0_60px_rgba(6,182,212,0.15)] relative group transition-all duration-500"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-t-[2rem]"></div>

        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-2">
          <Search size={14} className="text-cyan-500 animate-pulse" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">Premium Query Engine</span>
        </h3>

        <div ref={wrapperRef} className="relative z-20">
          <form onSubmit={(e) => { setShowSuggestions(false); fetchAnalytics(e); }} className="relative">
            <input
              type="text"
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search Product ID or Name..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-2xl py-4 pl-5 pr-14 outline-none text-sm font-medium text-slate-900 placeholder-slate-400 dark:bg-[#161920] dark:border-white/5 dark:focus:border-cyan-500/50 dark:text-white dark:placeholder-slate-600 transition-all font-mono shadow-inner"
            />
            <button
               type="button"
               onClick={(e) => {
                 if(searchId) {
                   e.preventDefault();
                   fetchAnalytics(null, searchId);
                 }
               }}
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
            >
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={2.5} />}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#161920]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col"
              >
                {suggestions.map((sugg) => (
                  <button
                    key={sugg.id}
                    type="button"
                    onClick={() => handleSuggestionClick(sugg.id)}
                    className="text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{sugg.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1 mt-0.5"><Tag size={10}/> {sugg.category}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Searches Pills */}
        {recentSearches && recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 relative z-10">
             <div className="flex items-center justify-center bg-slate-100 dark:bg-white/5 p-1.5 rounded-full text-slate-400" title="Recent Queries">
                <History size={12} />
             </div>
             {recentSearches.map((rs, i) => (
               <button 
                 key={i}
                 onClick={() => handleSuggestionClick(rs.id)}
                 className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-500/20 border border-slate-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
               >
                 <span className="truncate max-w-[100px]">{rs.name}</span> <span className="opacity-50">#{rs.id}</span>
               </button>
             ))}
          </div>
        )}
      </motion.div>

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
