import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { usePrice } from '../context/PriceContext';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-panel border border-cyan-500/30 rounded-2xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 mb-1 truncate max-w-[140px] leading-none">{d.store}</p>
      <p className="text-[9px] font-bold text-slate-400 mb-2">{d.location}</p>
      <p className="text-2xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">₹{d.price}</p>
    </div>
  );
};

const VolatilityChart = () => {
  const { analytics, theme } = usePrice();
  const isDark = theme === 'dark';

  const { chartData, avg, min, max, volatility, trend } = useMemo(() => {
    if (!analytics?.raw_data?.length) return {};
    const avg = parseFloat(analytics.average_price);
    const min = parseFloat(analytics.min_price);
    const max = parseFloat(analytics.max_price);
    const volatility = ((max - min) / avg * 100);
    const chartData = [...analytics.raw_data]
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .map((item, i) => ({
        index: i + 1,
        price: parseFloat(parseFloat(item.price).toFixed(2)),
        store: item.store_name || 'Unknown',
        location: item.location || '',
        label: `#${i + 1}`,
      }));
    const sorted = [...analytics.raw_data].sort((a, b) => a.id - b.id);
    const mid = Math.floor(sorted.length / 2);
    const firstAvg = sorted.slice(0, mid).reduce((s, r) => s + parseFloat(r.price), 0) / (mid || 1);
    const secondAvg = sorted.slice(mid).reduce((s, r) => s + parseFloat(r.price), 0) / ((sorted.length - mid) || 1);
    const trendPct = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1);
    const trend = { pct: trendPct, dir: parseFloat(trendPct) > 1 ? 'up' : parseFloat(trendPct) < -1 ? 'down' : 'flat' };
    return { chartData, avg, min, max, volatility, trend };
  }, [analytics]);

  if (!analytics || !chartData?.length) return null;

  const stabilityPct = Math.max(0, 100 - volatility).toFixed(1);
  const TrendIcon = trend?.dir === 'up' ? TrendingUp : trend?.dir === 'down' ? TrendingDown : Minus;
  const trendColor = trend?.dir === 'up' ? 'text-rose-500' : trend?.dir === 'down' ? 'text-emerald-500' : 'text-slate-400';
  const lineColor = isDark ? '#22d3ee' : '#06b6d4';

  return (
    <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-[2.5rem] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative overflow-hidden group transition-all duration-700">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-cyan-600/80 dark:text-cyan-400/60 flex items-center gap-2 leading-none">
            <Activity size={14} className="animate-pulse" /> Volatility Matrix
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 ${trendColor}`}>
              <TrendIcon size={14} />
            </div>
            <p className={`text-xs font-black tracking-tight ${trendColor}`}>
              {trend?.dir === 'up' ? 'Inflationary' : trend?.dir === 'down' ? 'Deflationary' : 'Neutral'} Trend
            </p>
            <span className="text-[10px] font-mono font-black text-slate-400 bg-white/40 dark:bg-black/20 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-white/5">
              {parseFloat(trend?.pct) > 0 ? '+' : ''}{trend?.pct}%
            </span>
          </div>
        </div>

        <div className="flex gap-4 p-1.5 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/10 shadow-inner">
          <div className="px-4 py-2 text-center group/v">
            <p className="text-[8px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Volatitly</p>
            <p className="font-mono text-xs font-black text-rose-500 tracking-tighter group-hover/v:scale-110 transition-transform">{volatility.toFixed(1)}%</p>
          </div>
          <div className="w-[1px] bg-slate-300 dark:bg-white/5" />
          <div className="px-4 py-2 text-center group/s">
            <p className="text-[8px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Stability</p>
            <p className="font-mono text-xs font-black text-cyan-500 tracking-tighter group-hover/s:scale-110 transition-transform">{stabilityPct}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {[
          { label: 'Min', val: min, theme: 'emerald' },
          { label: 'Avg', val: avg, theme: 'cyan' },
          { label: 'Max', val: max, theme: 'rose' }
        ].map(({ label, val, theme }) => (
          <div key={label} className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-2xl bg-${theme}-500/10 border border-${theme}-500/20 text-${theme}-600 dark:text-${theme}-400 group/stat hover:scale-105 transition-all`}>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
            <span className="font-mono font-black text-xs leading-none">₹{parseFloat(val).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 220 }} className="relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} tickFormatter={(v) => `₹${v}`} domain={['dataMin - 10', 'dataMax + 10']} width={60} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: lineColor, strokeWidth: 2, strokeDasharray: '4 4' }} />
            <ReferenceLine y={avg} stroke={lineColor} strokeDasharray="5 5" strokeOpacity={0.4} strokeWidth={2} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={3}
              fill="url(#cyberGrad)"
              animationDuration={1500}
              animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
              activeDot={{ r: 8, fill: '#fff', stroke: lineColor, strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-6 opacity-40">
        End-to-End Price Topology · Sorted Sequence
      </p>
    </div>
  );
};

export default VolatilityChart;
