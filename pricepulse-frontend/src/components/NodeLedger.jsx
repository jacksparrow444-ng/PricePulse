import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, List } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const ACCENT = {
  'Best Deal 🏷️': 'accent-success',
  'Fair':         'accent-neutral',
  'Above Avg':    'accent-warning',
  'High':         'accent-danger',
};

const NodeLedger = () => {
  const { analytics, selectedLocation, setSelectedLocation, theme } = usePrice();
  const isDark = theme === 'dark';

  if (!analytics?.raw_data) return null;

  const locations = ['All Areas', ...new Set(analytics.raw_data.map(i => i.location).filter(Boolean))];
  const filteredItems = selectedLocation === 'All Areas'
    ? analytics.raw_data
    : analytics.raw_data.filter(n => n.location === selectedLocation);

  const avg  = parseFloat(analytics.average_price);
  const high = parseFloat(analytics.fair_range?.high || 0);
  const low  = parseFloat(analytics.fair_range?.low  || 0);

  const getTag = (price) => {
    if (price >= avg * 1.25) return { text: 'High',          cls: 'tag-danger'  };
    if (price > high)        return { text: 'Above Avg',     cls: 'tag-warning' };
    if (price < low)         return { text: 'Best Deal 🏷️',  cls: 'tag-success' };
    return                          { text: 'Fair',           cls: 'tag-neutral' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-5 rounded-2xl flex flex-col h-full max-h-[500px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h3 className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2
          ${isDark ? 'text-slate-400' : 'text-indigo-500'}`}>
          <List size={14} /> Store Prices
        </h3>
        {/* Location filter pills */}
        {locations.length > 2 && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
            {locations.map(loc => (
              <button key={loc} onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap transition-all border
                  ${selectedLocation === loc
                    ? isDark
                      ? 'bg-indigo-500 text-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-md shadow-indigo-900/40'
                      : 'bg-indigo-500 text-white border-indigo-600 ring-2 ring-indigo-400/30 shadow-md shadow-indigo-200/60'
                    : isDark
                      ? 'text-slate-500 border-white/10 hover:text-slate-300 hover:border-white/20'
                      : 'text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-300 bg-white/60'
                  }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Store list */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((shop, idx) => {
            const price = parseFloat(shop.price);
            const tag = getTag(price);
            const accentClass = ACCENT[tag.text] || 'accent-neutral';
            const saving = avg - price;

            return (
              <motion.div
                key={`${shop.store_name}-${shop.location}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                className={`flex justify-between items-center px-4 py-3.5 rounded-xl border
                  transition-all group cursor-default overflow-hidden
                  ${accentClass}
                  ${isDark
                    ? 'bg-white/4 border-white/6 hover:border-indigo-500/30 hover:bg-indigo-500/8 hover:shadow-lg hover:shadow-indigo-900/20'
                    : 'bg-white/70 border-slate-200/60 hover:border-indigo-300/70 hover:bg-indigo-50/70 hover:shadow-md hover:shadow-indigo-100/60'
                  }
                  hover:scale-[1.015] hover:-translate-y-0.5`}
                style={{ transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {/* Left — Store info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                    ${isDark ? 'bg-white/5 group-hover:bg-indigo-500/15' : 'bg-indigo-50 group-hover:bg-indigo-100'}`}>
                    <Store size={15} className={isDark ? 'text-slate-400 group-hover:text-indigo-400' : 'text-indigo-400 group-hover:text-indigo-600'} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {shop.store_name}
                    </p>
                    <p className={`text-[9px] flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      <MapPin size={8} /> {shop.location}
                    </p>
                  </div>
                </div>

                {/* Right — Price + Tags */}
                <div className="text-right flex-shrink-0 ml-3 flex flex-col items-end gap-1.5">
                  <p className={`font-mono text-lg font-black leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    ₹{price.toFixed(2)}
                  </p>
                  <div className={`${tag.cls} px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wide`}>
                    {tag.text}
                  </div>
                  {/* Savings badge — green pill; shows on hover */}
                  {Math.abs(saving) > 0.5 && (
                    <div className={`text-[9px] font-black px-2 py-0.5 rounded-full border opacity-0 group-hover:opacity-100 transition-all duration-200
                      ${saving > 0
                        ? 'bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-500/12 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                      {saving > 0 ? `₹${saving.toFixed(0)} cheaper` : `₹${Math.abs(saving).toFixed(0)} costlier`}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NodeLedger;
