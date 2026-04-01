import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { usePrice } from '../context/PriceContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="bg-white/95 dark:bg-[#1a1f2e]/95 backdrop-blur-xl border border-slate-200 dark:border-cyan-500/20 rounded-2xl px-4 py-3 shadow-2xl"
      style={{ pointerEvents: 'none' }}
    >
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 truncate max-w-[140px]">{d.store}</p>
      <p className="text-[9px] text-slate-400 mb-1">{d.location}</p>
      <p className="text-xl font-black text-slate-800 dark:text-white">₹{d.price}</p>
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

    // Show ALL entries sorted by price (low → high) — no grouping
    const chartData = [...analytics.raw_data]
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .map((item, i) => ({
        index: i + 1,
        price: parseFloat(parseFloat(item.price).toFixed(2)),
        store: item.store_name || 'Unknown',
        location: item.location || '',
        label: `#${i + 1}`,
      }));

    // Trend: first half avg vs second half avg
    const mid = Math.floor(analytics.raw_data.length / 2);
    const sorted = [...analytics.raw_data].sort((a, b) => a.id - b.id);
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
    <div className="lg:col-span-2 bg-white dark:bg-[#0f1115] p-6 md:p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-2xl transition-all duration-500">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
            Price Volatility Matrix
          </h3>
          <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
            <TrendIcon size={11} className={trendColor} />
            <span className={trendColor}>
              {trend?.dir === 'up' ? 'Rising' : trend?.dir === 'down' ? 'Falling' : 'Stable'} Prices
            </span>
            <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono px-1.5 py-0.5 rounded text-[9px]">
              {parseFloat(trend?.pct) > 0 ? '+' : ''}{trend?.pct}%
            </span>
          </p>
        </div>

        {/* Volatility / Stability */}
        <div className="flex gap-3 bg-slate-50 dark:bg-[#161920] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5">
          <div className="text-right">
            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Volatility</p>
            <p className="font-mono text-[12px] font-black text-rose-500 dark:text-rose-400">{volatility.toFixed(1)}%</p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-white/10" />
          <div>
            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Stability</p>
            <p className="font-mono text-[12px] font-black text-cyan-600 dark:text-cyan-400">{stabilityPct}%</p>
          </div>
        </div>
      </div>

      {/* Min / Avg / Max chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Min', val: min, cls: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
          { label: 'Avg', val: avg, cls: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20' },
          { label: 'Max', val: max, cls: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
          { label: 'Nodes', val: chartData.length, cls: 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10' },
        ].map(({ label, val, cls }) => (
          <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold ${cls}`}>
            {label}: <span className="font-mono font-black">
              {label === 'Nodes' ? val : `₹${parseFloat(val).toFixed(0)}`}
            </span>
          </div>
        ))}
      </div>

      {/* Chart — shows ALL entries, sorted low→high */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={isDark ? '#22d3ee' : '#06b6d4'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isDark ? '#c084fc' : '#9333ea'} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#475569' : '#94a3b8', fontWeight: 700 }}
              interval={Math.floor(chartData.length / 6)}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#475569' : '#94a3b8', fontWeight: 600 }}
              tickFormatter={(v) => `₹${v}`}
              domain={[
                (d) => Math.max(0, d - d * 0.06),
                (d) => d + d * 0.06,
              ]}
              width={55}
            />

            {/* Average reference dashed line */}
            <ReferenceLine
              y={avg}
              stroke={lineColor}
              strokeDasharray="5 4"
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: lineColor, strokeWidth: 1.5, strokeDasharray: '4 4', strokeOpacity: 0.6 }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGrad)"
              dot={chartData.length <= 15
                ? { r: 3, fill: lineColor, strokeWidth: 0, fillOpacity: 0.8 }
                : false
              }
              activeDot={{ r: 7, fill: '#fff', stroke: lineColor, strokeWidth: 2.5 }}
              animationDuration={700}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-[9px] text-slate-400 dark:text-slate-600 mt-3 font-semibold uppercase tracking-widest">
        All {chartData.length} price entries · sorted low → high
      </p>
    </div>
  );
};

export default VolatilityChart;
