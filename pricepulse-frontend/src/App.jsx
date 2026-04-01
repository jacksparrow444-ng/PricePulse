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

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000); // 30s Refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-500">
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
            background: theme === 'dark' ? '#0f1115' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#0f172a',
            border: '1px solid rgba(34,211,238,0.3)',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '16px 24px',
            backdropFilter: 'blur(10px)'
          }
        }} 
      />

      {/* ULTRA SCI-FI Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none transition-opacity duration-1000">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[80px] rounded-full mix-blend-screen opacity-50 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[80px] rounded-full mix-blend-screen opacity-50 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_40%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-20 z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAA1JREFUGNNjYBgF6AAAA6AAAe7v96IAAAAASUVORK5CYII=')] opacity-[0.03] dark:opacity-[0.08] pointer-events-none z-20"></div>
      </div>

      {/* Main app — fades in after splash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative min-h-screen flex flex-col">
          <Header />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 mt-8">
            {/* Left Column: Input & Controls */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={splashDone ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-4 space-y-8"
            >
              <QueryEngine />
              <DataInjection />

              {/* System Stats Mini-Panel */}
              {systemStats && (
                <div className="glass-panel rounded-2xl p-4 shadow-xl transition-all duration-500 overflow-hidden relative">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Products', val: systemStats.total_products, color: 'text-slate-800 dark:text-white' },
                      { label: 'Entries', val: systemStats.total_entries, color: 'text-cyan-500' },
                      { label: 'Locations', val: systemStats.total_locations, color: 'text-purple-500' },
                      { label: 'Vendors', val: systemStats.total_vendors, color: 'text-emerald-500' }
                    ].map((stat, i) => (
                      <div key={i} className={`text-center ${i > 0 ? 'border-l border-white/10' : ''}`}>
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`font-mono font-black text-[12px] ${stat.color}`}>{stat.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column: Insights & Ledger */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={splashDone ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:col-span-8 space-y-8 h-full"
            >
              {analytics ? (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <AnalyticsDashboard />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <VolatilityChart />
                    <NodeLedger />
                  </div>
                </div>
              ) : (
                <div className="glass-panel h-full min-h-[500px] rounded-[3rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden transition-all duration-500">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 glass-panel rounded-full flex items-center justify-center mb-8 relative shadow-inner">
                      <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-[spin_4s_linear_infinite]"></div>
                      <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-[spin_3s_linear_infinite_reverse]"></div>
                      <div className="text-4xl">🔎</div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-3 uppercase italic">Awaiting Matrix Instructions</h2>
                    <p className="max-w-xs text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed opacity-70">
                      Initialize the query engine with a Product ID or inject new data into the matrix core.
                    </p>
                  </div>
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