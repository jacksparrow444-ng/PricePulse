import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Code2, PenTool, BugPlay, Crown } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 bg-white/40 dark:bg-[#0f1115]/40 backdrop-blur-2xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden group transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand & Team */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                PricePulse <span className="text-cyan-500">.</span>
              </h2>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                Made with <Heart size={10} className="inline text-rose-500 mx-0.5 animate-pulse" fill="currentColor" /> by <span className="text-slate-700 dark:text-slate-300 font-black">Pokemon Team</span>
              </p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 md:gap-8 w-full md:w-auto">
          
          {/* Team Leader */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-white/60 dark:bg-[#161920]/80 p-3 md:p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all cursor-crosshair">
            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Crown size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Team Leader</p>
              <p className="text-sm font-black text-slate-800 dark:text-white bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-colors">Nirmal Kumar</p>
            </div>
          </motion.div>

          {/* Members */}
          <div className="flex flex-col gap-3">
            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 group cursor-pointer">
               <Code2 size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
               <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors"><span className="text-slate-400 dark:text-slate-500 font-medium">Dev:</span> Tanishq</p>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 group cursor-pointer">
               <PenTool size={14} className="text-pink-500 group-hover:scale-110 transition-transform" />
               <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-pink-500 transition-colors"><span className="text-slate-400 dark:text-slate-500 font-medium">Design:</span> Taniya Singla</p>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 group cursor-pointer">
               <BugPlay size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
               <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors"><span className="text-slate-400 dark:text-slate-500 font-medium">Test:</span> Tanisha Dua</p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Floating Help Icon */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 15 }} 
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-[0_10px_40px_rgba(34,211,238,0.4)] flex items-center justify-center text-white z-50 overflow-hidden group"
        onClick={() => alert("Search by Product ID or Name!\n\nMade by Pokemon Team.")}
      >
        <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
      </motion.button>
    </footer>
  );
};

export default Footer;
