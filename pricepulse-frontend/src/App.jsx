import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

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

function App() {
  const { 
    theme, fetchSystemStats, systemStats, analytics
  } = usePrice();

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000); // 30s Refresh
    return () => clearInterval(interval);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-500">
      
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
          }
        }} 
      />

      {/* ULTRA SCI-FI Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none transition-opacity duration-1000">
        
        {/* Deep Space Neon Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[150px] rounded-full mix-blend-screen opacity-60 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen opacity-60 animate-[pulse_8s_ease-in-out_infinite_reverse]" />
        
        {/* Holographic Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_40%,transparent_100%)] opacity-50"></div>

        {/* Cyberpunk Scanlines Overylay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-20 z-10"></div>

        {/* Existing Cinematic Grain */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-[0.15] mix-blend-overlay transition-opacity duration-500 animate-grain pointer-events-none z-20"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1400px] mx-auto">
        <Header />

        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column Controls */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6 relative z-50">
            <QueryEngine />
            <DataInjection />

            {systemStats && (
              <div className="grid grid-cols-4 gap-2 bg-white dark:bg-[#0f1115] border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl transition-colors duration-500">
                {[
                  { label: 'Products', val: systemStats.total_products, color: 'text-slate-800 dark:text-white' },
                  { label: 'Entries', val: systemStats.total_entries, color: 'text-cyan-600 dark:text-cyan-400' },
                  { label: 'Locations', val: systemStats.total_locations, color: 'text-purple-600 dark:text-purple-400' },
                  { label: 'Vendors', val: systemStats.total_vendors, color: 'text-emerald-600 dark:text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className={`text-center ${i > 0 ? 'border-l border-slate-100 dark:border-white/5' : ''}`}>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`font-mono font-bold ${stat.color}`}>{stat.val}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column Analytics */}
          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col h-full">
            {analytics ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 flex-1">
                <AnalyticsDashboard />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <VolatilityChart />
                  <NodeLedger />
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[500px] border border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-xl rounded-[3rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden transition-colors duration-500">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center mb-8 bg-slate-50 dark:bg-[#161920] relative shadow-inner">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 dark:border-cyan-500/30 animate-[spin_4s_linear_infinite]"></div>
                    <div className="absolute inset-2 rounded-full border border-purple-400/20 dark:border-purple-500/20 animate-[spin_3s_linear_infinite_reverse]"></div>
                    <div className="text-4xl">🔎</div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-3">Awaiting Instructions</h2>
                  <p className="max-w-xs text-slate-500 font-medium text-xs leading-relaxed">
                    Initialize the query engine with a Product ID or inject new data into the matrix.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.main>
        
        {/* Made by Pokemon Team Footer */}
        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.4); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .mask-image-scroll { -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); mask-image: linear-gradient(to right, black 80%, transparent 100%); }
      `}} />
    </div>
  );
}

export default App;