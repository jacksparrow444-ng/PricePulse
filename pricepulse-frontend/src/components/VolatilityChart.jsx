import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';
import { usePrice } from '../context/PriceContext';
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';

/* ── Premium Glass Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className={`rounded-2xl px-4 py-3 shadow-2xl border text-left min-w-[130px]
      ${isDark
        ? 'bg-[#1a1f2e]/97 border-white/10 backdrop-blur-xl'
        : 'bg-white/97 border-indigo-100/80 shadow-indigo-200/50 backdrop-blur-xl'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      <div className={`text-[8px] font-black uppercase tracking-[0.15em] mb-0.5 truncate max-w-[120px]
        ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d.store}</div>
      <div className={`text-[9px] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{d.location}</div>
      <div className={`text-2xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
        ₹{d.price}
      </div>
      <div className={`mt-1 text-[8px] font-bold ${d.price < d.avg ? 'text-emerald-500' : d.price > d.avg * 1.15 ? 'text-rose-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {d.price < d.avg ? `₹${(d.avg - d.price).toFixed(2)} below avg` : d.price > d.avg * 1.15 ? `₹${(d.price - d.avg).toFixed(2)} above avg` : 'Near average'}
      </div>
    </div>
  );
};

const VolatilityChart = () => {
  const { analytics, theme } = usePrice();
  const isDark = theme === 'dark';

  const { chartData, avg, min, max, volatility, stability, trend } = useMemo(() => {
    if (!analytics?.raw_data?.length) return {};
    const avg = parseFloat(analytics.average_price);
    const min = parseFloat(analytics.min_price);
    const max = parseFloat(analytics.max_price);
    const volatility = ((max - min) / avg * 100);
    const stability = Math.max(0, 100 - volatility);

    const chartData = [...analytics.raw_data]
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .map((item, i) => ({
        index: i + 1,
        price: parseFloat(parseFloat(item.price).toFixed(2)),
        store: item.store_name || 'Unknown',
        location: item.location || '',
        label: `#${i + 1}`,
        avg,
      }));

    // Trend: compare first half vs second half
    const sorted = [...analytics.raw_data].sort((a, b) => a.id - b.id);
    const mid = Math.floor(sorted.length / 2);
    const firstAvg = sorted.slice(0, mid).reduce((s, r) => s + parseFloat(r.price), 0) / (mid || 1);
    const secondAvg = sorted.slice(mid).reduce((s, r) => s + parseFloat(r.price), 0) / ((sorted.length - mid) || 1);
    const trendPct = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1);
    const trendDir = parseFloat(trendPct) > 1 ? 'up' : parseFloat(trendPct) < -1 ? 'down' : 'flat';
    const trend = { pct: trendPct, dir: trendDir };

    return { chartData, avg, min, max, volatility, stability, trend };
  }, [analytics]);

  if (!analytics || !chartData?.length) return null;

  const lineColor = isDark ? '#22d3ee' : '#6366f1';
  const TrendIcon = trend?.dir === 'up' ? TrendingUp : trend?.dir === 'down' ? TrendingDown : Minus;
  const trendLabel = trend?.dir === 'up' ? 'Prices Going Up' : trend?.dir === 'down' ? 'Prices Coming Down' : 'Stable';
  const trendCls = trend?.dir === 'up' ? 'tag-danger' : trend?.dir === 'down' ? 'tag-success' : 'tag-neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel card-hover p-6 rounded-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-3 flex-wrap">
        <div>
          <p className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-1.5
            ${isDark ? 'text-slate-400' : 'text-indigo-500'}`}>
            <BarChart2 size={14} /> Price History
          </p>
          <div className="flex items-center gap-2">
            <span className={`${trendCls} flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-lg`}>
              <TrendIcon size={12} /> {trendLabel}
            </span>
            <span className={`font-mono text-[11px] font-bold px-2 py-1 rounded-lg border
              ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              {parseFloat(trend?.pct) > 0 ? '+' : ''}{trend?.pct}%
            </span>
          </div>
        </div>

        {/* Volatility + Stability */}
        <div className={`flex gap-3 px-4 py-2.5 rounded-xl border
          ${isDark ? 'bg-white/5 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-right">
            <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Price Spread
            </p>
            <p className="font-mono text-sm font-black text-rose-500">{volatility.toFixed(1)}%</p>
          </div>
          <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className="text-right">
            <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Consistency
            </p>
            <p className={`font-mono text-sm font-black ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>
              {stability.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick price pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Low', val: min, cls: 'tag-success' },
          { label: 'Avg', val: avg, cls: 'tag-neutral' },
          { label: 'High', val: max, cls: 'tag-danger' },
          { label: `${chartData.length} reports`, val: null, plain: true },
        ].map(({ label, val, cls, plain }) => (
          <div key={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border
              ${plain
                ? isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400 bg-slate-50'
                : cls
              }`}>
            <span className="opacity-60">{label}</span>
            {val !== null && <span className="font-mono font-black text-sm">₹{parseFloat(val).toFixed(0)}</span>}
          </div>
        ))}
      </div>

      {/* ── CHART ──────────────────────────────────────────────── */}
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="60%" stopColor={lineColor} stopOpacity={0.08} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.06)'} />

            <XAxis dataKey="label" axisLine={false} tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#475569' : '#94a3b8', fontWeight: 700 }}
              interval={Math.max(0, Math.floor(chartData.length / 6) - 1)} dy={8} />

            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#475569' : '#94a3b8', fontWeight: 600 }}
              tickFormatter={(v) => `₹${v}`}
              domain={[(d) => Math.max(0, d - d * 0.08), (d) => d + d * 0.08]}
              width={58} />

            {/* Average reference line */}
            <ReferenceLine y={avg} stroke={lineColor} strokeDasharray="5 5"
              strokeOpacity={0.45} strokeWidth={1.5} />

            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{ stroke: lineColor, strokeWidth: 1.5, strokeDasharray: '4 4', strokeOpacity: 0.5 }}
            />

            <Area
              type="monotone" dataKey="price"
              stroke={lineColor} strokeWidth={2.5}
              fillOpacity={1} fill="url(#areaFill)"
              dot={chartData.length <= 20
                ? { r: 3, fill: lineColor, strokeWidth: 0, opacity: 0.7 }
                : false
              }
              activeDot={{ r: 7, fill: '#fff', stroke: lineColor, strokeWidth: 2.5, filter: `drop-shadow(0 0 6px ${lineColor})` }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className={`text-center text-[9px] font-medium mt-2
        ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
        {chartData.length} prices · sorted lowest → highest
      </p>
    </motion.div>
  );
};

export default VolatilityChart;
