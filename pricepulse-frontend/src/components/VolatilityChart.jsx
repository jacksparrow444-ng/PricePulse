import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { usePrice } from '../context/PriceContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-cyan-500/20 rounded-2xl px-4 py-3 shadow-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{d.label}</p>
      <p className="text-xl font-black text-slate-800 dark:text-white">₹{d.price}</p>
    </div>
  );
};

const VolatilityChart = () => {
  const { analytics, theme } = usePrice();
  const isDark = theme === 'dark';

  // ── Process & clean chart data ───────────────────────────────────────────
  const { chartData, avg, min, max, volatility, trend } = useMemo(() => {
    if (!analytics?.raw_data?.length) return {};

    const avg = parseFloat(analytics.average_price);
    const min = parseFloat(analytics.min_price);
    const max = parseFloat(analytics.max_price);
    const volatility = ((max - min) / avg * 100);

    // Group by store → take average price per store
    const storeMap = {};
    analytics.raw_data.forEach(item => {
      const store = item.store_name?.substring(0, 12) || 'Unknown';
      if (!storeMap[store]) storeMap[store] = [];
      storeMap[store].push(parseFloat(item.price));
    });

    // Build chart points sorted by average price (low → high = natural smooth curve)
    const chartData = Object.entries(storeMap)
      .map(([store, prices]) => ({
        label: store,
        price: parseFloat((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)),
      }))
      .sort((a, b) => a.price - b.price);

    // Trend: compare first half average to second half average
    const mid = Math.floor(analytics.raw_data.length / 2);
    const firstHalfAvg = analytics.raw_data.slice(0, mid)
      .reduce((s, r) => s + parseFloat(r.price), 0) / mid;
    const secondHalfAvg = analytics.raw_data.slice(mid)
      .reduce((s, r) => s + parseFloat(r.price), 0) / (analytics.raw_data.length - mid);
    const trendPct = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100).toFixed(1);
    const trend = { pct: trendPct, up: parseFloat(trendPct) > 0 };

    return { chartData, avg, min, max, volatility, trend };
  }, [analytics]);

  if (!analytics || !chartData?.length) return null;

  const volatilityLabel = volatility > 20
    ? 'High Instability' : volatility > 10
    ? 'Moderately Volatile' : 'Stable Market';

  const stabilityPct = Math.max(0, 100 - volatility).toFixed(1);

  const TrendIcon = trend?.up ? TrendingUp : trend?.pct === '0.0' ? Minus : TrendingDown;
  const trendColor = trend?.up
    ? 'text-rose-500' : trend?.pct === '0.0'
    ? 'text-slate-400' : 'text-emerald-500';

  const lineColor = isDark ? '#22d3ee' : '#06b6d4';
  const gradTop = isDark ? '#22d3ee' : '#06b6d4';
  const gradBot = isDark ? '#c084fc' : '#9333ea';

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#0f1115] p-6 md:p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Price Volatility Matrix
          </h3>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
            <TrendIcon size={12} className={trendColor} />
            <span className={trendColor}>
              {trend?.up ? 'Upward' : 'Downward'} Trend
            </span>
            <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono px-1.5 py-0.5 rounded text-[10px]">
              {trend?.up ? '+' : ''}{trend?.pct}% spread
            </span>
          </p>
        </div>

        {/* Stats pills */}
        <div className="flex gap-3 bg-slate-50 dark:bg-[#161920] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5">
          <div className="text-right">
            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Volatility</p>
            <p className="font-mono text-[11px] font-black text-rose-500 dark:text-rose-400">
              {volatility.toFixed(1)}%
            </p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-white/10" />
          <div className="text-left">
            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Stability</p>
            <p className="font-mono text-[11px] font-black text-cyan-600 dark:text-cyan-400">
              {stabilityPct}%
            </p>
          </div>
        </div>
      </div>

      {/* Min / Avg / Max chips */}
      <div className="flex gap-2 mb-5">
        {[
          { label: 'Min', val: min, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
          { label: 'Avg', val: avg, color: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20' },
          { label: 'Max', val: max, color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
        ].map(({ label, val, color }) => (
          <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold ${color}`}>
            {label}: <span className="font-mono font-black">₹{parseFloat(val).toFixed(0)}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={gradTop} stopOpacity={0.35} />
                <stop offset="95%" stopColor={gradBot} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#94a3b8', fontWeight: 600 }}
              interval={0}
              dy={8}
            />

            <YAxis
              hide
              domain={[
                (dataMin) => Math.max(0, dataMin - dataMin * 0.08),
                (dataMax) => dataMax + dataMax * 0.08,
              ]}
            />

            {/* Average reference line */}
            <ReferenceLine
              y={avg}
              stroke={lineColor}
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              strokeWidth={1}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: lineColor, strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGrad)"
              dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff', stroke: lineColor, strokeWidth: 2.5 }}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom label */}
      <p className="text-center text-[9px] text-slate-400 dark:text-slate-600 mt-3 font-semibold uppercase tracking-widest">
        Prices sorted low → high across stores · {chartData.length} nodes
      </p>
    </div>
  );
};

export default VolatilityChart;
