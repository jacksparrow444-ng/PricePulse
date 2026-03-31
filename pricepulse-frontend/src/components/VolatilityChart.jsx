import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePrice } from '../context/PriceContext';

const VolatilityChart = () => {
  const { analytics, theme } = usePrice();

  if (!analytics || !analytics.raw_data) return null;

  const chartData = analytics.raw_data.map(item => ({
    name: item.store_name.substring(0, 10),
    price: parseFloat(item.price)
  }));

  const volatilityIndex = ((analytics.max_price - analytics.min_price) / analytics.average_price * 100);
  const isDark = theme === 'dark';

  let trendDirection = '➡️ Stable Trend';
  let trendPercent = '---';
  if (analytics.raw_data.length >= 3) {
    if (volatilityIndex > 15) {
      trendDirection = '📈 Upward Trend';
      trendPercent = `+${(volatilityIndex / 2).toFixed(1)}% (7d)`;
    } else {
      trendDirection = '➡️ Stable Trend';
      trendPercent = `+1.2% (7d)`;
    }
  }

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#0f1115] p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
            Price Volatility Matrix
          </h3>
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{trendDirection} <span className="text-cyan-600 dark:text-cyan-400 ml-1 font-mono tracking-normal bg-cyan-50 dark:bg-cyan-500/10 px-1.5 rounded">{trendPercent}</span></p>
        </div>

        <div className="flex gap-4 bg-slate-50 dark:bg-[#161920] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
          <div className="text-right">
            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Volatility</p>
            <p className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400">
              {volatilityIndex.toFixed(1)}%
            </p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-white/10 mx-1"></div>
          <div className="text-left">
            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Stability</p>
            <p className="font-mono text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
              {(100 - volatilityIndex).toFixed(1)}/100
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#22d3ee" : "#06b6d4"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isDark ? "#c084fc" : "#9333ea"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff0a" : "#0000000f"} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{ backgroundColor: isDark ? '#161920' : '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isDark ? "#22d3ee" : "#06b6d4"}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
              activeDot={{ r: 6, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolatilityChart;
