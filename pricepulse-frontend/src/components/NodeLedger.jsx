import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Activity, ListFilter } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const NodeLedger = () => {
  const { analytics, selectedLocation, setSelectedLocation } = usePrice();

  if (!analytics?.raw_data) return null;

  const availableLocations = ['All Nodes', ...new Set(analytics.raw_data.map(i => i.location))];
  const filteredNodes = selectedLocation === 'All Nodes'
    ? analytics.raw_data
    : analytics.raw_data.filter(n => n.location === selectedLocation);

  const getStatus = (price) => {
    const avg = parseFloat(analytics.average_price);
    const high = parseFloat(analytics.fair_range.high);
    const low = parseFloat(analytics.fair_range.low);
    if (price >= avg * 1.25) return { text: 'OUTLIER (H)', color: 'text-rose-500', bg: 'bg-rose-500/10' };
    if (price > high)        return { text: 'ABOVE_AVG',    color: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (price < low)         return { text: 'DEAL_NODE',    color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    return                          { text: 'NOMINAL',    color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] flex flex-col h-full max-h-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative overflow-hidden group transition-all duration-700">
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4 relative z-10">
        <h3 className="font-black text-xs uppercase tracking-[0.3em] text-cyan-600/80 dark:text-cyan-400/60 flex items-center gap-2 shrink-0">
          <ListFilter size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Node Ledger
        </h3>
        {availableLocations.length > 2 && (
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 mask-image-scroll pr-4">
            {availableLocations.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap border ${
                  selectedLocation === loc
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 bg-white/40 dark:bg-black/20 border-slate-200 dark:border-white/5'
                }`}
              >
                {loc === 'All Nodes' ? 'Global' : loc.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredNodes.map((shop, idx) => {
            const priceVal = parseFloat(shop.price);
            const status = getStatus(priceVal);
            return (
              <motion.div
                key={`${shop.store_name}-${shop.location}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-between items-center p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-cyan-500/30 hover:glow-cyan transition-all group/item"
              >
                <div className="min-w-0 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10 group-hover/item:bg-cyan-500 group-hover/item:text-white transition-all duration-500">
                    <Store size={18} className="group-hover/item:scale-110 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 dark:text-white text-xs truncate leading-none mb-1.5">{shop.store_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={10} className="shrink-0 text-cyan-500" /> {shop.location}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-mono text-sm font-black text-slate-900 dark:text-white tracking-tighter">₹{priceVal.toFixed(2)}</p>
                  <div className={`mt-2 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] ${status.color} ${status.bg} border border-${status.color.split('-')[1]}-500/20 w-fit ml-auto shadow-sm`}>
                    {status.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-700">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
        </div>
      </div>
    </div>
  );
};

export default NodeLedger;
