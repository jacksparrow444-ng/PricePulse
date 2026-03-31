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
          <div className="flex items-center gap-3 bg-white/60 dark:bg-[#161920]/80 p-3 md:p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Crown size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Team Leader</p>
              <p className="text-sm font-black text-slate-800 dark:text-white">Nirmal Kumar</p>
            </div>
          </div>

          {/* Members */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
               <Code2 size={14} className="text-blue-500" />
               <p className="text-xs font-semibold text-slate-700 dark:text-slate-300"><span className="text-slate-400 dark:text-slate-500 font-medium">Dev:</span> Tanishq</p>
            </div>
            <div className="flex items-center gap-2">
               <PenTool size={14} className="text-pink-500" />
               <p className="text-xs font-semibold text-slate-700 dark:text-slate-300"><span className="text-slate-400 dark:text-slate-500 font-medium">Design:</span> Taniya Singla</p>
            </div>
            <div className="flex items-center gap-2">
               <BugPlay size={14} className="text-emerald-500" />
               <p className="text-xs font-semibold text-slate-700 dark:text-slate-300"><span className="text-slate-400 dark:text-slate-500 font-medium">Test:</span> Tanisha Dua</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
