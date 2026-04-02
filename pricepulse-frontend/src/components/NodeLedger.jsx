import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, List } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const NodeLedger = () => {
  const { analytics, selectedLocation, setSelectedLocation, theme } = usePrice();
  const isDark = theme === 'dark';

  if (!analytics?.raw_data) return null;

  const locations = ['All Areas', ...new Set(analytics.raw_data.map(i => i.location))];
  const filteredItems = selectedLocation === 'All Areas'
    ? analytics.raw_data
    : analytics.raw_data.filter(n => n.location === selectedLocation);

  const getTag = (price) => {
    const avg = parseFloat(analytics.average_price);
    const high = parseFloat(analytics.fair_range.high);
    const low = parseFloat(analytics.fair_range.low);
    if (price >= avg * 1.25) return { text: 'High', color: 'text-rose-500', bg: isDark ? 'bg-rose-500/10' : 'bg-rose-50', border: isDark ? 'border-rose-500/20' : 'border-rose-200' };
    if (price > high)        return { text: 'Above Avg', color: 'text-amber-500', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', border: isDark ? 'border-amber-500/20' : 'border-amber-200' };
    if (price < low)         return { text: 'Best Deal', color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', border: isDark ? 'border-emerald-500/20' : 'border-emerald-200' };
    return                          { text: 'Fair', color: isDark ? 'text-slate-400' : 'text-slate-500', bg: isDark ? 'bg-white/5' : 'bg-slate-100', border: isDark ? 'border-white/10' : 'border-slate-200' };
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full max-h-[420px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <h3 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2
          ${isDark ? 'text-slate-400' : 'text-indigo-500'}`}>
          <List size={13} /> Store Prices
        </h3>
        {locations.length > 2 && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap transition-all border
                  ${selectedLocation === loc
                    ? isDark
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'bg-indigo-500 text-white border-indigo-500'
                    : isDark
                      ? 'text-slate-500 border-white/10 hover:text-slate-300 hover:border-white/20'
                      : 'text-slate-400 border-slate-200 hover:text-indigo-500 hover:border-indigo-200 bg-white/60'
                  }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((shop, idx) => {
            const price = parseFloat(shop.price);
            const tag = getTag(price);
            return (
              <motion.div
                key={`${shop.store_name}-${shop.location}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.025, 0.25) }}
                className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all
                  ${isDark
                    ? 'bg-white/5 border-white/5 hover:border-white/10'
                    : 'bg-white/70 border-slate-200/60 hover:border-indigo-200/80 hover:bg-white/90 shadow-sm'
                  }`}
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                    <Store size={14} className={isDark ? 'text-slate-500' : 'text-indigo-400'} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-xs truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {shop.store_name}
                    </p>
                    <p className={`text-[9px] flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      <MapPin size={8} /> {shop.location}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`font-mono text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    ₹{price.toFixed(2)}
                  </p>
                  <div className={`mt-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wide border w-fit ml-auto
                    ${tag.color} ${tag.bg} ${tag.border}`}>
                    {tag.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NodeLedger;
