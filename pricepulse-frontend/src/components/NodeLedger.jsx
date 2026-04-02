import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, List } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const NodeLedger = () => {
  const { analytics, selectedLocation, setSelectedLocation, theme } = usePrice();
  const isDark = theme === 'dark';

  if (!analytics?.raw_data) return null;

  const locations = ['All Areas', ...new Set(analytics.raw_data.map(i => i.location).filter(Boolean))];
  const filteredItems = selectedLocation === 'All Areas'
    ? analytics.raw_data
    : analytics.raw_data.filter(n => n.location === selectedLocation);

  const avg = parseFloat(analytics.average_price);
  const high = parseFloat(analytics.fair_range?.high || 0);
  const low  = parseFloat(analytics.fair_range?.low  || 0);

  const getTag = (price) => {
    if (price >= avg * 1.25) return { text: 'High',        cls: 'tag-danger' };
    if (price > high)        return { text: 'Above Avg',   cls: 'tag-warning' };
    if (price < low)         return { text: 'Best Deal 🏷️', cls: 'tag-success' };
    return                          { text: 'Fair',         cls: 'tag-neutral' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel card-hover p-6 rounded-2xl flex flex-col h-full max-h-[500px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-2">
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

      {/* Shop list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((shop, idx) => {
            const price = parseFloat(shop.price);
            const tag = getTag(price);
            const savingVsHigh = avg - price;
            return (
              <motion.div
                key={`${shop.store_name}-${shop.location}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                className={`flex justify-between items-center px-3.5 py-3.5 rounded-xl border transition-all group
                  ${isDark
                    ? 'bg-white/4 border-white/6 hover:border-indigo-500/30 hover:bg-indigo-500/8'
                    : 'bg-white/70 border-slate-200/60 hover:border-indigo-300/70 hover:bg-indigo-50/70 shadow-sm hover:shadow-md'
                  }`}
                style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                    <Store size={14} className={isDark ? 'text-slate-500' : 'text-indigo-400'} />
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

                <div className="text-right flex-shrink-0 ml-3 flex flex-col items-end gap-1">
                    <p className={`font-mono text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    ₹{price.toFixed(2)}
                  </p>
                  <div className={`${tag.cls} px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wide`}>
                    {tag.text}
                  </div>
                  {/* Show savings vs average */}
                  {Math.abs(savingVsHigh) > 0.5 && (
                    <p className={`text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity
                      ${savingVsHigh > 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {savingVsHigh > 0 ? `₹${savingVsHigh.toFixed(0)} cheaper` : `₹${Math.abs(savingVsHigh).toFixed(0)} costlier`}
                    </p>
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
