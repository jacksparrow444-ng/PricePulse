import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ShieldCheck, Info, Image as ImageIcon, DownloadCloud, TrendingDown, TrendingUp, Sparkles, Brain, Zap } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { usePrice } from '../context/PriceContext';

/* ── AI Smart Suggestion Engine ─────────────────────────────── */
const getAISuggestion = (analytics) => {
  const avg = parseFloat(analytics.average_price);
  const minP = parseFloat(analytics.min_price);
  const maxP = parseFloat(analytics.max_price);
  const fairLow = parseFloat(analytics.fair_range?.low || 0);
  const fairHigh = parseFloat(analytics.fair_range?.high || 0);
  const volatility = ((maxP - minP) / avg * 100);
  const isNearMin = avg <= minP * 1.08;
  const isNearMax = avg >= maxP * 0.92;
  const isStable = volatility < 10;
  const samples = analytics.total_samples;

  if (isNearMin && samples >= 5)
    return { emoji: '🎯', label: 'Best Time to Buy', color: 'success', detail: `Price is near its lowest (₹${minP.toFixed(0)})` };
  if (isNearMax)
    return { emoji: '⏳', label: 'Wait for Better Price', color: 'danger', detail: `Currently near peak (₹${maxP.toFixed(0)})` };
  if (isStable)
    return { emoji: '✅', label: 'Stable — Safe to Buy', color: 'neutral', detail: 'Market price is consistent' };
  if (volatility > 25)
    return { emoji: '📉', label: 'Prices Dropping — Hold', color: 'warning', detail: `High variance of ${volatility.toFixed(0)}%` };
  if (avg <= fairHigh && avg >= fairLow)
    return { emoji: '👍', label: 'Fair Price — Good Buy', color: 'neutral', detail: 'Within the fair price range' };
  return { emoji: '📊', label: 'Moderate Market', color: 'neutral', detail: 'Price is in the mid range' };
};

const AI_CLS = {
  success: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
  danger:  { bg: 'bg-rose-50 dark:bg-rose-500/10',   border: 'border-rose-200 dark:border-rose-500/20',   text: 'text-rose-600 dark:text-rose-400' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
  neutral: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400' },
};

const AnalyticsDashboard = () => {
  const { analytics, searchId, IMAGE_BASE, theme } = usePrice();
  const isDark = theme === 'dark';

  if (!analytics) return null;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageW, 32, 'F');
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 26, pageW, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text('PRICEPULSE', 14, 18);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.setTextColor(220, 220, 255);
      doc.text('AI PRICE REPORT', 14, 26);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - 14, 26, { align: 'right' });
      doc.setTextColor(20, 20, 40);
      doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.text(analytics.product_name || 'Unknown Product', 14, 50);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 110, 130);
      doc.text(`Product ID: ${analytics.product_id || searchId}`, 14, 58);
      doc.text(`Category: ${analytics.category || 'General'}`, 14, 64);
      const aiSug = getAISuggestion(analytics);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(79, 70, 229);
      doc.text(`AI Suggestion: ${aiSug.emoji} ${aiSug.label}`, 14, 72);
      const kpiY = 80, kpiH = 22, kpiW = (pageW - 28 - 6) / 3;
      [
        { label: 'AVERAGE PRICE', value: `INR ${parseFloat(analytics.average_price).toFixed(2)}`, accent: [99, 102, 241] },
        { label: 'LOWEST PRICE', value: `INR ${parseFloat(analytics.min_price).toFixed(2)}`, accent: [16, 185, 129] },
        { label: 'HIGHEST PRICE', value: `INR ${parseFloat(analytics.max_price).toFixed(2)}`, accent: [239, 68, 68] },
      ].forEach((kpi, i) => {
        const x = 14 + i * (kpiW + 3);
        doc.setFillColor(...kpi.accent);
        doc.roundedRect(x, kpiY, kpiW, kpiH, 3, 3, 'F');
        doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
        doc.text(kpi.label, x + kpiW / 2, kpiY + 7, { align: 'center' });
        doc.setFontSize(11);
        doc.text(kpi.value, x + kpiW / 2, kpiY + 16, { align: 'center' });
      });
      const volatility = ((analytics.max_price - analytics.min_price) / analytics.average_price * 100).toFixed(1);
      autoTable(doc, {
        startY: kpiY + kpiH + 10,
        head: [['Detail', 'Value']],
        body: [
          ['Product Name', analytics.product_name || 'N/A'],
          ['Product ID', String(analytics.product_id || searchId)],
          ['Average Price', `INR ${parseFloat(analytics.average_price).toFixed(2)}`],
          ['Lowest Price', `INR ${parseFloat(analytics.min_price).toFixed(2)}`],
          ['Highest Price', `INR ${parseFloat(analytics.max_price).toFixed(2)}`],
          ['Fair Buy Range', `INR ${parseFloat(analytics.fair_range?.low || 0).toFixed(2)} — ${parseFloat(analytics.fair_range?.high || 0).toFixed(2)}`],
          ['Price Spread', `${volatility}%`],
          ['Total Reports', `${analytics.total_samples}`],
          ['AI Suggestion', `${aiSug.emoji} ${aiSug.label}`],
        ],
        headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: [240, 242, 255] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 75 } },
        margin: { left: 14, right: 14 },
      });
      const finalY = doc.lastAutoTable.finalY + 12;
      doc.setFillColor(245, 246, 255); doc.rect(14, finalY, pageW - 28, 18, 'F');
      doc.setTextColor(100, 110, 140); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
      doc.text('Pokemon Team · PricePulse', 18, finalY + 7);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
      doc.text('Lead: Nirmal Kumar  |  Dev: Tanishq  |  Design: Taniya Singla  |  QA: Tanisha Dua', 18, finalY + 13);
      doc.save(`PricePulse_${(analytics.product_name || 'product').replace(/\s+/g,'_')}.pdf`);
    } catch (err) {
      alert('Could not generate PDF. Try again.');
    }
  };

  const confidenceScore = Math.min(Math.round((analytics.total_samples / 30) * 100), 100);
  const PIE_COLORS = isDark ? ['#22d3ee', '#1e293b'] : ['#6366f1', '#e0e7ff'];
  const pieData = [{ value: confidenceScore }, { value: 100 - confidenceScore }];
  const avg = parseFloat(analytics.average_price);
  const minP = parseFloat(analytics.min_price);
  const maxP = parseFloat(analytics.max_price);
  const volatilityIndex = ((maxP - minP) / avg * 100);
  const priceSaving = maxP - avg;
  const savingPct = ((priceSaving / maxP) * 100).toFixed(0);

  let marketStatus = { text: '🟢 Stable Prices', cls: 'tag-success' };
  if (volatilityIndex > 20) marketStatus = { text: '🔴 Prices Vary a Lot', cls: 'tag-danger' };
  else if (volatilityIndex > 10) marketStatus = { text: '🟡 Slightly Unstable', cls: 'tag-warning' };

  const aiSug = getAISuggestion(analytics);
  const aiCls = AI_CLS[aiSug.color];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-up">
      {/* ── MAIN PRICE CARD ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="md:col-span-2 glass-panel card-hover p-7 rounded-2xl relative overflow-hidden"
      >
        {/* Background glow orb */}
        <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: isDark ? 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />

        {/* Top badges row */}
        <div className="flex justify-between items-start mb-5 flex-wrap gap-2 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="tag-success text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck size={11} /> Community Average
            </span>
            {priceSaving > 0 && (
              <span className="tag-neutral text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full flex items-center gap-1">
                <TrendingDown size={10} /> {savingPct}% below max
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-dashed
              ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-400 border-slate-300/60'}`}>
              ID: {searchId}
            </span>
            <button onClick={handleDownloadPDF}
              className={`btn-primary flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all
                ${isDark
                  ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white'
                  : 'bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-500 hover:text-white'
                }`}>
              <DownloadCloud size={12} /> PDF
            </button>
          </div>
        </div>

        {/* Product name */}
        <p className={`text-sm font-semibold mb-1 relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {analytics.category || 'Product'}
        </p>
        <h3 className={`text-xl font-black tracking-tight mb-5 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {analytics.product_name}
        </h3>

        {/* ── HERO PRICE — gradient text ──────────────────────── */}
        <div className="relative z-10 mb-6">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Average market price
          </p>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex items-start gap-2"
          >
            <span className={`text-4xl font-black mt-3 ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`}>₹</span>
            <span
              className="price-hero font-black leading-none text-6xl sm:text-7xl lg:text-[88px]"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #ffffff 0%, #22d3ee 60%, #818cf8 100%)'
                  : 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: isDark ? 'drop-shadow(0 0 20px rgba(34,211,238,0.3))' : 'drop-shadow(0 0 20px rgba(99,102,241,0.2))',
              }}
            >
              {parseFloat(analytics.average_price).toFixed(2)}
            </span>
          </motion.div>
        </div>

        {/* ── AI SMART SUGGESTION ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 mb-5 flex items-start gap-3 px-4 py-3.5 rounded-2xl border ${aiCls.bg} ${aiCls.border}`}
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${aiCls.border} bg-white/50 dark:bg-black/20`}>
            <Brain size={16} className={aiCls.text} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black ${aiCls.text} flex items-center gap-1.5`}>
                <Sparkles size={11} />
                AI Suggestion
              </span>
              <span className={`text-xs font-black ${aiCls.text}`}>
                {aiSug.emoji} {aiSug.label}
              </span>
            </div>
            <p className={`text-[10px] font-medium mt-0.5 opacity-70 ${aiCls.text}`}>
              {aiSug.detail} · Based on {analytics.total_samples} community reports
            </p>
          </div>
          {/* Sparkle icon top-right */}
          <Zap size={14} className={`absolute right-3 top-3 opacity-30 ${aiCls.text}`} />
        </motion.div>

        {/* ── PRICE RANGE BAR ─────────────────────────────────── */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1
              ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Fair Price Range <Info size={10} />
            </p>
          </div>
          <div className={`relative h-2.5 rounded-full mb-3 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
            <div className="absolute inset-y-0 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-rose-400"
              style={{
                left: `${((parseFloat(analytics.fair_range?.low || 0) - minP) / (maxP - minP || 1)) * 100}%`,
                right: `${100 - ((parseFloat(analytics.fair_range?.high || 0) - minP) / (maxP - minP || 1)) * 100}%`,
              }} />
            {/* Average marker — bigger + animated */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{
                left: `${((avg - minP) / (maxP - minP || 1)) * 100}%`,
                background: isDark ? '#22d3ee' : '#6366f1',
                boxShadow: isDark ? '0 0 10px rgba(34,211,238,0.6)' : '0 0 10px rgba(99,102,241,0.5)',
              }}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border
              ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
              <TrendingDown size={12} />₹ {parseFloat(analytics.fair_range?.low || 0).toFixed(2)}
              <span className="text-[9px] font-medium opacity-60">low</span>
            </div>
            <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>—</span>
            <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border
              ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
              <TrendingUp size={12} />₹ {parseFloat(analytics.fair_range?.high || 0).toFixed(2)}
              <span className="text-[9px] font-medium opacity-60">high</span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className={`pt-4 border-t flex items-center justify-between gap-3 flex-wrap relative z-10
          ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
          <p className={`text-xs font-medium flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-cyan-500' : 'bg-indigo-400'}`} />
            Based on <strong className={`mx-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{analytics.total_samples} reports</strong>
          </p>
          <span className={`${marketStatus.cls} text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full`}>
            {marketStatus.text}
          </span>
        </div>
      </motion.div>

      {/* ── RIGHT COLUMN ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Confidence ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel card-hover p-5 rounded-2xl flex flex-col items-center justify-center flex-1 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-28 h-28 rounded-full pointer-events-none blur-3xl opacity-40"
            style={{ background: isDark ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.15)' }} />
          <div className="relative hover:scale-105 transition-transform duration-300" style={{ width: 116, height: 116 }}>
            <PieChart width={116} height={116}>
              <Pie data={pieData} cx={58} cy={58} innerRadius={34} outerRadius={52}
                dataKey="value" startAngle={90} endAngle={-270} stroke="none"
                strokeWidth={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % 2]} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-black leading-none ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>
                {confidenceScore}%
              </span>
              <span className={`text-[8px] font-bold mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                confidence
              </span>
            </div>
          </div>
          <div className="mt-3 text-center relative z-10">
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Data Confidence
            </p>
            <p className={`text-[9px] mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              {analytics.total_samples} of 30 reports
            </p>
          </div>
        </motion.div>

        {/* Price stats mini cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-2xl p-4 space-y-2.5"
        >
          {[
            { label: 'Lowest Found', value: minP, cls: 'tag-success' },
            { label: 'Community Avg', value: avg, cls: 'tag-neutral' },
            { label: 'Highest Found', value: maxP, cls: 'tag-danger' },
          ].map(({ label, value, cls }) => (
            <div key={label}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${cls} card-hover cursor-default`}>
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</span>
              <span className="font-mono font-black text-sm">₹{parseFloat(value).toFixed(2)}</span>
            </div>
          ))}
        </motion.div>

        {/* Photo proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-h-[90px]"
        >
          {analytics.last_image ? (
            <div className="glass-panel card-hover rounded-2xl relative overflow-hidden h-full min-h-[90px] group cursor-pointer">
              <img src={`${IMAGE_BASE}${analytics.last_image}`}
                className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-20 group-hover:scale-105 transition-transform duration-700"
                alt="Photo proof" />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0f1115]' : 'from-white/90 via-white/40'} to-transparent`} />
              <div className="absolute bottom-3 left-3">
                <span className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border backdrop-blur-md
                  ${isDark ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
                  <ImageIcon size={10} className={isDark ? 'text-cyan-400' : 'text-indigo-500'} /> Photo Proof
                </span>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center h-full min-h-[90px] transition-colors
              ${isDark ? 'border-white/10 bg-white/3' : 'border-slate-200 bg-slate-50/80'}`}>
              <ImageIcon size={18} className={isDark ? 'text-slate-700' : 'text-slate-300'} />
              <p className={`text-[9px] font-semibold mt-1.5 ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>No photo added</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
