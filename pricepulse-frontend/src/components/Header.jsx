import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Sun, Moon, Settings2, History } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const Header = () => {
  const { theme, toggleTheme, lastUpdated, recentSearches, fetchAnalytics } = usePrice();
  const [timeAgo, setTimeAgo] = useState('just now');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - lastUpdated) / 1000);
      setTimeAgo(diff < 5 ? 'just now' : `${diff}s ago`);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-12 relative z-50"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <Activity className="text-white z-10" size={24} />
          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse opacity-20"></div>
        </div>
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight animate-glitch relative inline-block">
            PricePulse <span className="text-cyan-500">.</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-0.5">Advanced Hyperlocal Intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm"
          >
            <History size={14} /> Recent
          </button>
          
          {showHistory && recentSearches.length > 0 && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 gap-1 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              {recentSearches.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => { fetchAnalytics(null, s.id); setShowHistory(false); }}
                  className="flex flex-col items-start p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">{s.name}</span>
                  <span className="text-[8px] font-mono text-slate-400">ID: {s.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white/40 dark:bg-black/20 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/5">
          <Clock size={12} /> Sync: {timeAgo}
        </span>

        <button
          onClick={toggleTheme}
          className="p-2.5 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors backdrop-blur-md text-slate-500"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
        </button>

        <button className="p-2.5 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors backdrop-blur-md">
          <Settings2 strokeWidth={1.5} size={18} className="text-slate-500" />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
