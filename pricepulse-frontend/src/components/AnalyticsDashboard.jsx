import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Image as ImageIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { usePrice } from '../context/PriceContext';

const AnalyticsDashboard = () => {
  const { analytics, searchId, IMAGE_BASE, theme } = usePrice();

  if (!analytics) return null;

  const confidenceScore = Math.min(Math.round((analytics.total_samples / 30) * 100), 100);
  const isDark = theme === 'dark';
  const PIE_COLORS = isDark ? ['#22d3ee', '#1e293b'] : ['#0891b2', '#e2e8f0'];
  const pieData = [{ name: 'Conf', value: confidenceScore }, { name: 'Rem', value: 100 - confidenceScore }];

  const volatilityIndex = ((analytics.max_price - analytics.min_price) / analytics.average_price * 100);

  let marketClassification = {
    text: '🟢 Stable Market',
    color: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10'
  };
  if (volatilityIndex > 20) marketClassification = {
    text: '🚨 High Instability',
    color: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-500/20',
    bg: 'bg-rose-100 dark:bg-rose-500/10'
  };
  else if (volatilityIndex > 10) marketClassification = {
    text: '🟡 Moderately Volatile',
    color: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-400/20',
    bg: 'bg-amber-100 dark:bg-amber-400/10'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 border-slate-200/60 dark:from-[#0f1115] dark:to-[#161920] p-8 rounded-[2.5rem] border dark:border-white/5 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-2xl transition-colors duration-500">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-400/10 blur-[80px] rounded-full group-hover:bg-cyan-500/15 transition-colors duration-1000"></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <p className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <ShieldCheck size={14} /> Community Consensus Price
          </p>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-2 bg-white/50 dark:bg-transparent px-2 py-1 rounded-md">ID: {searchId}</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">{analytics.product_name}</h3>

        <div className="flex items-end gap-6 relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-slate-800 dark:text-white tracking-tighter">
            <span className="text-cyan-500 text-4xl align-top">Rs. </span>
            {analytics.average_price}
          </h2>
          <div className="pb-2 relative group cursor-help mt-4 md:mt-0">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-1 flex items-center gap-1">
              Optimal Range <Info size={10} className="text-slate-300 dark:text-slate-400" />
            </p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/20 px-3 py-1 rounded-lg">
              Rs. {analytics.fair_range.low} <span className="text-slate-400 dark:text-slate-600 font-light mx-1">-</span> Rs. {analytics.fair_range.high}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Verified across <strong className="text-slate-800 dark:text-white mx-1">{analytics.total_samples} nodes</strong>
          </p>
          <div className={`px-3 py-1.5 rounded-full border ${marketClassification.border} ${marketClassification.bg} relative group cursor-help transition-colors`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${marketClassification.color}`}>
              {marketClassification.text}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white dark:bg-[#0f1115] p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/5 flex-1 flex flex-col justify-center relative overflow-hidden items-center group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-500">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-400/10 blur-[40px] rounded-full"></div>

          <div className="relative w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={45}
                  dataKey="value" startAngle={90} endAngle={-270} stroke="none"
                >
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-cyan-600 leading-none">{confidenceScore}%</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2 relative z-10">Data Confidence</p>
        </div>

        {analytics.last_image ? (
          <div className="bg-slate-100 dark:bg-[#0f1115] p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/5 flex-1 relative overflow-hidden group cursor-pointer min-h-[120px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors duration-500">
            <img src={`${IMAGE_BASE}${analytics.last_image}`} className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-30 group-hover:opacity-80 transition-opacity mix-blend-multiply dark:mix-blend-luminosity duration-500" alt="Evidence" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#0f1115] dark:via-[#0f1115]/80"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <p className="text-slate-700 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full w-fit shadow-sm">
                <ImageIcon size={12} /> Last Node Evidence
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-[#161920] p-6 rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px] opacity-80 cursor-not-allowed transition-colors duration-500">
            <ImageIcon size={20} className="text-slate-400 mb-2" />
            <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest text-center mt-1">No Evidence<br />Synchronized</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
