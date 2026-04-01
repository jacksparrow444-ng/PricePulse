import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const NodeLedger = () => {
  const { analytics, selectedLocation, setSelectedLocation } = usePrice();

  if (!analytics?.raw_data) return null;

  const availableLocations = ['All', ...new Set(analytics.raw_data.map(i => i.location))];
  const filteredNodes = selectedLocation === 'All'
    ? analytics.raw_data
    : analytics.raw_data.filter(n => n.location === selectedLocation);

  const getStatus = (price) => {
    const avg = parseFloat(analytics.average_price);
    const high = parseFloat(analytics.fair_range.high);
    const low = parseFloat(analytics.fair_range.low);
    if (price >= avg * 1.25) return { text: 'Outlier', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10' };
    if (price > high)        return { text: 'Over',    color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/10' };
    if (price < low)         return { text: 'Deal',    color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' };
    return                          { text: 'Fair',    color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-white/5' };
  };

  return (
    <div className="bg-white dark:bg-[#0f1115] p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 flex flex-col h-full max-h-[380px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-2xl transition-all duration-500">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 gap-2">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 shrink-0">
          <Store size={13} className="text-purple-500" /> Node Ledger
        </h3>
        {availableLocations.length > 2 && (
          <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-0.5">
            {availableLocations.slice(0, 5).map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                  selectedLocation === loc
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {loc === 'All' ? 'All' : loc.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredNodes.map((shop, idx) => {
            const priceVal = parseFloat(shop.price);
            const status = getStatus(priceVal);
            return (
              <motion.div
                key={`${shop.store_name}-${shop.location}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, delay: Math.min(idx * 0.025, 0.3), ease: 'easeOut' }}
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#161920] rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-sm transition-all"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{shop.store_name}</p>
                  <p className="text-[8px] font-semibold text-slate-400 uppercase flex items-center gap-1 mt-0.5">
                    <MapPin size={8} className="shrink-0" /> {shop.location}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-mono text-xs font-black text-slate-900 dark:text-white">₹{priceVal.toFixed(2)}</p>
                  <div className={`mt-1 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${status.color} ${status.bg} w-fit ml-auto`}>
                    {status.text}
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
