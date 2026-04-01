import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="glass-panel flex items-center justify-between px-6 py-4 rounded-[2rem] mb-8 relative overflow-hidden group z-50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-500">
          <Activity size={24} strokeWidth={2.5} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
            PricePulse <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
          </h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-600/80 dark:text-cyan-400/60 leading-none mt-1">
            Hyperlocal Intelligence Node v4.0
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {/* Quick Stats / Status */}
        <div className="hidden md:flex items-center gap-4 mr-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Network Status</span>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Synchronized
            </span>
          </div>
        </div>

        <div className="relative group">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:glow-cyan transition-all group/btn active:scale-95"
          >
            <History size={18} className="group-hover/btn:rotate-[-10deg] transition-transform" />
          </button>
          
          <AnimatePresence>
            {showHistory && recentSearches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-48 glass-panel rounded-2xl p-2 gap-1 flex flex-col shadow-2xl z-50"
              >
                {recentSearches.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => { fetchAnalytics(null, s.id); setShowHistory(false); }}
                    className="flex flex-col items-start p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left group/item"
                  >
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full group-hover/item:text-cyan-500">{s.name}</span>
                    <span className="text-[8px] font-mono text-slate-400">ID: {s.id}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="hidden md:flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-500 bg-white/40 dark:bg-black/20 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/5">
          <Clock size={12} className="text-cyan-500" /> {timeAgo}
        </span>

        <button
          onClick={toggleTheme}
          className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-full hover:glow-cyan transition-all group active:scale-95 border border-transparent hover:border-cyan-500/30"
        >
          {theme === 'dark' ? 
            <Sun size={18} className="text-amber-400 group-hover:rotate-45 transition-transform" /> : 
            <Moon size={18} className="text-indigo-600 group-hover:-rotate-12 transition-transform" />
          }
        </button>

        <button className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-full hover:glow-purple transition-all group active:scale-95 border border-transparent hover:border-purple-500/30">
          <Settings2 strokeWidth={1.5} size={18} className="text-slate-500 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
