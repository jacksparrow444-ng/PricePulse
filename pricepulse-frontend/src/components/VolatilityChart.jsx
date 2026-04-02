import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { usePrice } from '../context/PriceContext';
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-xl border text-left
      ${isDark
        ? 'bg-[#1a1f2e]/95 border-white/10'
        : 'bg-white border-slate-200 shadow-indigo-100/60'
      }`}
      style={{ pointerEvents: 'none' }}>
      <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 truncate max-w-[130px]
        ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{d.store}</p>
      <p className={`text-[9px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d.location}</p>
      <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>₹{d.price}</p>
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
  const trendLabel = trend?.dir === 'up' ? 'Prices Going Up' : trend?.dir === 'down' ? 'Prices Coming Down' : 'Prices Stable';
  const trendColor = isDark
    ? (trend?.dir === 'up' ? 'text-rose-400' : trend?.dir === 'down' ? 'text-emerald-400' : 'text-slate-400')
    : (trend?.dir === 'up' ? 'text-rose-600' : trend?.dir === 'down' ? 'text-emerald-600' : 'text-slate-400');

  const lineColor = isDark ? '#22d3ee' : '#6366f1';

  return (
    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 gap-3 flex-wrap">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2
            ${isDark ? 'text-slate-400' : 'text-indigo-500'}`}>
            <BarChart2 size={12} /> Price History
          </p>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
              <TrendIcon size={13} className={trendColor} />
            </div>
            <p className={`text-xs font-bold ${trendColor}`}>{trendLabel}</p>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border
              ${isDark
                ? 'text-slate-400 bg-white/5 border-white/10'
                : 'text-slate-500 bg-white border-slate-200'
              }`}>
              {parseFloat(trend?.pct) > 0 ? '+' : ''}{trend?.pct}%
            </span>
          </div>
        </div>

        {/* Spread stats */}
        <div className={`flex gap-4 px-4 py-2.5 rounded-xl border text-right
          ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div>
            <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Price Spread
            </p>
            <p className={`font-mono text-xs font-black text-rose-500`}>{volatility.toFixed(1)}%</p>
          </div>
          <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div>
            <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Consistency
            </p>
            <p className={`font-mono text-xs font-black ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>{stabilityPct}%</p>
          </div>
        </div>
      </div>

      {/* Price chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Lowest', val: min, theme: 'emerald' },
          { label: 'Average', val: avg, theme: isDark ? 'cyan' : 'indigo' },
          { label: 'Highest', val: max, theme: 'rose' },
          { label: 'Reports', val: chartData.length, isCount: true, theme: 'slate' },
        ].map(({ label, val, theme: t, isCount }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold border
            ${isDark
              ? `bg-${t === 'cyan' ? 'cyan' : t}-500/10 border-${t === 'cyan' ? 'cyan' : t}-500/20 text-${t === 'cyan' ? 'cyan' : t}-${t === 'slate' ? '400' : '400'}`
              : `bg-${t}-50 border-${t}-200 text-${t}-${t === 'slate' ? '500' : '700'}`
            }`}>
            <span className="opacity-60">{label}:</span>
            <span className="font-mono font-black">
              {isCount ? val : `₹${parseFloat(val).toFixed(0)}`}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
            <XAxis dataKey="label" axisLine={false} tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#475569' : '#94a3b8', fontWeight: 700 }}
              interval={Math.floor(chartData.length / 6)} dy={8} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#475569' : '#94a3b8', fontWeight: 600 }}
              tickFormatter={(v) => `₹${v}`}
              domain={[(d) => Math.max(0, d - d * 0.06), (d) => d + d * 0.06]}
              width={55} />
            <ReferenceLine y={avg} stroke={lineColor} strokeDasharray="5 4" strokeOpacity={0.4} strokeWidth={1.5} />
            <Tooltip content={<CustomTooltip isDark={isDark} />}
              cursor={{ stroke: lineColor, strokeWidth: 1.5, strokeDasharray: '4 4', strokeOpacity: 0.5 }} />
            <Area type="monotone" dataKey="price"
              stroke={lineColor} strokeWidth={2.5}
              fillOpacity={1} fill="url(#areaGrad)"
              dot={chartData.length <= 15 ? { r: 3, fill: lineColor, strokeWidth: 0 } : false}
              activeDot={{ r: 6, fill: '#fff', stroke: lineColor, strokeWidth: 2.5 }}
              animationDuration={800} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className={`text-center text-[9px] font-medium mt-3
        ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
        {chartData.length} prices reported · sorted lowest to highest
      </p>
    </div>
  );
};

export default VolatilityChart;
