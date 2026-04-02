import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Loader2, Tag, History, ChevronRight } from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import axios from 'axios';

const QueryEngine = () => {
  const { searchId, setSearchId, fetchAnalytics, isSearching, analytics, recentSearches, IMAGE_BASE, theme } = usePrice();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const isDark = theme === 'dark';

  const updateDropdownPosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({ position: 'fixed', top: rect.bottom + 6, left: rect.left, width: rect.width, zIndex: 99999 });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSuggestions) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [showSuggestions]);

  useEffect(() => {
    const fetchSugg = async () => {
      if (!searchId || searchId.length < 2) { setSuggestions([]); return; }
      try {
        const res = await axios.get(`${IMAGE_BASE}/api/suggestions?q=${searchId}`);
        setSuggestions(res.data);
      } catch { /* silent */ }
    };
    const t = setTimeout(fetchSugg, 300);
    return () => clearTimeout(t);
  }, [searchId, IMAGE_BASE]);

  const handleSuggestionClick = (id) => {
    setSearchId(id.toString());
    setShowSuggestions(false);
    fetchAnalytics(null, id.toString());
  };

  const dropdown = (
    <AnimatePresence>
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12 }}
          style={dropdownStyle}
          className={`rounded-2xl shadow-2xl overflow-hidden border
            ${isDark
              ? 'bg-[#161920] border-white/10'
              : 'bg-white border-indigo-100 shadow-indigo-100/80'
            }`}
        >
          {suggestions.map((sugg) => (
            <button
              key={sugg.id}
              type="button"
              aria-label={`Suggest: ${sugg.name}`}
              onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(sugg.id); }}
              className={`w-full text-left px-4 py-3 border-b last:border-0 flex items-center justify-between group transition-colors
                ${isDark
                  ? 'border-white/5 hover:bg-white/5 text-white'
                  : 'border-slate-100 hover:bg-indigo-50 text-slate-800'
                }`}
            >
              <div>
                <p className="text-sm font-semibold">{sugg.name}</p>
                <p className={`text-[10px] flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Tag size={9} /> {sugg.category}
                </p>
              </div>
              <ChevronRight size={14} className={`group-hover:translate-x-0.5 transition-transform ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-2xl p-5">
        {/* Section label */}
        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2
          ${isDark ? 'text-slate-400' : 'text-indigo-500'}`}>
          <Search size={12} />
          Search Products
        </p>

        <div ref={wrapperRef} className="relative">
          <form onSubmit={(e) => { setShowSuggestions(false); fetchAnalytics(e); }} className="relative">
            <input
              ref={inputRef}
              type="text"
              aria-label="Search by name or ID"
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value); setShowSuggestions(true); updateDropdownPosition(); }}
              onFocus={() => { setShowSuggestions(true); updateDropdownPosition(); }}
              placeholder="Search by name or ID..."
              className={`w-full rounded-xl py-3.5 pl-4 pr-14 outline-none text-sm font-medium transition-all
                ${isDark
                  ? 'bg-white/5 border border-white/10 focus:border-cyan-500/50 text-white placeholder-slate-500 focus:bg-white/8'
                  : 'bg-white border border-slate-200 focus:border-indigo-400 text-slate-800 placeholder-slate-400 shadow-sm focus:shadow-indigo-100/60 focus:shadow-md'
                }`}
            />
            <button
              type="button"
              aria-label="Submit search"
              onClick={(e) => { if (searchId) { e.preventDefault(); fetchAnalytics(null, searchId); } }}
              disabled={isSearching}
              className={`absolute right-2 top-2 bottom-2 aspect-square text-white rounded-lg flex items-center justify-center transition-all
                ${isDark
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-cyan-500/20'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-300/40'
                } shadow-md disabled:opacity-50`}
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
          </form>
          {ReactDOM.createPortal(dropdown, document.body)}
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px]
              ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
              <History size={11} />
            </div>
            <AnimatePresence>
              {recentSearches.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.04 }}
                  onClick={() => handleSuggestionClick(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all
                    ${isDark
                      ? 'bg-[#161920] border border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 shadow-sm'
                    }`}
                >
                  {s.name}
                  <span className="opacity-40 font-mono text-[8px]">#{s.id}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Active product pill */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-panel rounded-xl px-4 py-3 flex items-center justify-between`}
        >
          <div>
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1
              ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Tag size={9} /> Showing prices for:
            </p>
            <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {analytics.product_name}
              <span className={`font-mono text-[10px] ml-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                #{analytics.product_id || searchId}
              </span>
            </p>
          </div>
          <div className={`text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full
            ${isDark
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
            }`}>
            {analytics.category || 'General'}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QueryEngine;
