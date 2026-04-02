import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Context
import { usePrice } from './context/PriceContext';

// Modular Components
import Header from './components/Header';
import QueryEngine from './components/QueryEngine';
import DataInjection from './components/DataInjection';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import VolatilityChart from './components/VolatilityChart';
import NodeLedger from './components/NodeLedger';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

function App() {
  const { theme, fetchSystemStats, systemStats, analytics } = usePrice();
  const [splashDone, setSplashDone] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 relative overflow-hidden
      ${isDark
        ? 'bg-[#050508] text-slate-300'
        : 'text-slate-800'
      }
    `}
      style={!isDark ? {
        background: 'linear-gradient(135deg, #eef2ff 0%, #e8eeff 25%, #f5f0ff 55%, #eef4ff 80%, #f0f7ff 100%)',
        minHeight: '100vh',
      } : undefined}
    >
      {/* Splash intro */}
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onDone={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: isDark ? '#0f1115' : '#ffffff',
            color: isDark ? '#fff' : '#1e1b4b',
            border: isDark ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(99,102,241,0.25)',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '700',
            padding: '14px 24px',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(99,102,241,0.15)',
          }
        }}
      />

      {/* ── BACKGROUND LAYER ─────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {isDark ? (
          /* Dark mode: keep existing neon orbs */
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[80px] rounded-full mix-blend-screen opacity-50 animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[80px] rounded-full mix-blend-screen opacity-50 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_40%,transparent_100%)]" />
          </>
        ) : (
          /* Light mode: soft indigo/violet orbs — premium feel */
          <>
            <div className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] opacity-40 blur-[120px] rounded-full animate-[pulse_9s_ease-in-out_infinite]"
              style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.45) 0%, rgba(167,139,250,0.3) 50%, transparent 100%)' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] opacity-35 blur-[100px] rounded-full animate-[pulse_11s_ease-in-out_infinite_reverse]"
              style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.4) 0%, rgba(99,102,241,0.25) 60%, transparent 100%)' }} />
            <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] opacity-25 blur-[80px] rounded-full animate-[pulse_7s_ease-in-out_infinite]"
              style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)' }} />
            {/* Subtle dot grid */}
            <div className="absolute inset-0 opacity-[0.35]"
              style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.25) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          </>
        )}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative min-h-screen flex flex-col">
          <Header />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start flex-1 mt-8">
            {/* Left Column */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={splashDone ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="lg:col-span-4 space-y-6"
            >
              <QueryEngine />
              <DataInjection />

              {/* Live Stats Bar */}
              {systemStats && (
                <div className="glass-panel rounded-2xl px-5 py-4 transition-all duration-500">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Products', val: systemStats.total_products, color: isDark ? 'text-white' : 'text-indigo-700' },
                      { label: 'Reports', val: systemStats.total_entries, color: isDark ? 'text-cyan-400' : 'text-violet-600' },
                      { label: 'Cities', val: systemStats.total_locations, color: isDark ? 'text-purple-400' : 'text-purple-600' },
                      { label: 'Shops', val: systemStats.total_vendors, color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
                    ].map((stat, i) => (
                      <div key={i} className={`text-center ${i > 0 ? 'border-l border-slate-200 dark:border-white/10' : ''}`}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`font-mono font-black text-base ${stat.color}`}>{stat.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={splashDone ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="lg:col-span-8 space-y-6 h-full"
            >
              {analytics ? (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <AnalyticsDashboard />
                  <VolatilityChart />
                  <NodeLedger />
                </div>
              ) : (
                <div className="glass-panel h-full min-h-[480px] rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                  {/* Decorative ring */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 relative"
                    style={{ background: isDark ? 'rgba(6,182,212,0.08)' : 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <div className="absolute inset-0 rounded-full border border-indigo-400/20 animate-[spin_6s_linear_infinite]"></div>
                    <span className="text-3xl">🛒</span>
                  </div>
                  <h2 className={`text-2xl font-black tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Search a product to see prices
                  </h2>
                  <p className={`max-w-xs text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Type any product name on the left — milk, oil, noodles — and see what people are paying near you.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <Footer />
        </div>
      </motion.div>
    </div>
  );
}

export default App;