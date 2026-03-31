import React from 'react';
import { Store, MapPin } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const NodeLedger = () => {
  const { analytics, selectedLocation, setSelectedLocation } = usePrice();

  if (!analytics || !analytics.raw_data) return null;

  const availableLocations = ['All', ...new Set(analytics.raw_data.map(item => item.location))];
  const filteredNodes = selectedLocation === 'All' ? analytics.raw_data : analytics.raw_data.filter(n => n.location === selectedLocation);

  const calculateStatus = (price) => {
    const avg = parseFloat(analytics.average_price);
    const fairHigh = parseFloat(analytics.fair_range.high);
    const fairLow = parseFloat(analytics.fair_range.low);

    if (price > fairHigh) {
      if (price >= avg * 1.25) return { text: '🚨 Outlier', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-600/10' };
      return { text: '⚠️ Over', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/10' };
    } else if (price < fairLow) {
      return { text: '🟢 Deal', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' };
    }
    return { text: '⚪ Fair', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-white/5' };
  };

  return (
    <div className="bg-white dark:bg-[#0f1115] p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 flex flex-col h-full max-h-[360px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Store size={14} className="text-purple-500" /> Node Ledger
        </h3>
        {availableLocations.length > 2 && (
          <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1 max-w-[120px]">
            {availableLocations.map(loc => (
              <button key={loc} onClick={() => setSelectedLocation(loc)} className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap ${selectedLocation === loc ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'text-slate-400 hover:text-slate-600'}`}>{loc}</button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredNodes.map((shop, idx) => {
          const priceVal = parseFloat(shop.price);
          const status = calculateStatus(priceVal);

          return (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#161920] rounded-2xl border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors group">
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{shop.store_name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-0.5">
                  <MapPin size={8} /> {shop.location}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-mono text-xs font-black text-slate-900 dark:text-white">Rs. {shop.price}</p>
                <div className={`mt-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${status.color} ${status.bg} w-fit ml-auto`}>
                  {status.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeLedger;
