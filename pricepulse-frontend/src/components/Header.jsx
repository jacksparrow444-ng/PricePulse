import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Sun, Moon, History } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const Header = () => {
  const { theme, toggleTheme, lastUpdated, recentSearches, fetchAnalytics } = usePrice();
  const [timeAgo, setTimeAgo] = React.useState('just now');
  const [showHistory, setShowHistory] = React.useState(false);
  const isDark = theme === 'dark';

  React.useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - lastUpdated) / 1000);
      setTimeAgo(diff < 5 ? 'just now' : `${diff}s ago`);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel flex items-center justify-between px-5 py-3.5 rounded-2xl mb-6 relative z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg
          ${isDark
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/25'
          }`}>
          <Activity size={18} strokeWidth={2.5} className="animate-pulse" />
        </div>
        <div>
          <h1 className={`text-lg font-black tracking-tight leading-none flex items-center gap-1.5
            ${isDark ? 'text-white' : 'text-slate-800'}`}>
            PricePulse
            <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-cyan-500' : 'bg-indigo-500'}`}></span>
          </h1>
          <p className={`text-[9px] font-bold uppercase tracking-[0.25em] leading-none mt-0.5
            ${isDark ? 'text-cyan-400/60' : 'text-indigo-500/70'}`}>
            Live Price Tracker
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Live status */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full
          bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live</span>
        </div>

        {/* Time ago */}
        <span className={`hidden md:flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-full
          ${isDark
            ? 'text-slate-400 bg-black/20 border border-white/5'
            : 'text-slate-500 bg-white/60 border border-slate-200/80'
          }`}>
          <Clock size={11} className={isDark ? 'text-cyan-500' : 'text-indigo-400'} />
          {timeAgo}
        </span>

        {/* History */}
        <div className="relative">
          <button
            aria-label="Recent Searches"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all
              ${isDark
                ? 'bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-white/10'
                : 'bg-white/60 text-slate-400 hover:text-indigo-500 hover:bg-white/80 border border-slate-200/60'
              }`}
          >
            <History size={16} />
          </button>

          <AnimatePresence>
            {showHistory && recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-52 glass-panel rounded-2xl p-2 flex flex-col gap-1 shadow-xl z-50"
              >
                <p className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Recent Searches
                </p>
                {recentSearches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { fetchAnalytics(null, s.id); setShowHistory(false); }}
                    className={`flex flex-col items-start px-3 py-2 rounded-xl transition-colors text-left
                      ${isDark
                        ? 'hover:bg-white/5 text-slate-200'
                        : 'hover:bg-indigo-50 text-slate-700'
                      }`}
                  >
                    <span className="text-[11px] font-bold truncate w-full">{s.name}</span>
                    <span className={`text-[9px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ID: {s.id}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          aria-label="Toggle Theme"
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all
            ${isDark
              ? 'bg-white/5 hover:bg-white/10 text-slate-400'
              : 'bg-white/60 hover:bg-white/80 text-slate-500 border border-slate-200/60'
            }`}
        >
          {isDark
            ? <Sun size={16} className="text-amber-400 hover:rotate-45 transition-transform" />
            : <Moon size={16} className="text-indigo-500" />
          }
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
