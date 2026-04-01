import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Crown, Code, PenTool, Cpu, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto pt-16 pb-8 relative z-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      
      <div className="glass-panel rounded-[3rem] px-8 py-10 relative overflow-hidden group shadow-[0_-20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 backdrop-blur-3xl">
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-colors"></div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          {/* Logo & Vision Block */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xs transition-transform duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Activity size={20} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">PricePulse <span className="text-cyan-500">.</span></h2>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 leading-relaxed">
              Decentralized Market Intelligence Infrastructure
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Made with</span>
              <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">by Pokemon Team</span>
            </div>
          </div>

          {/* Architectural Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 max-w-2xl px-4 lg:px-8">
            <div className="glass-panel p-4 rounded-3xl flex items-center gap-4 hover:border-cyan-500/30 transition-all group/card shadow-sm hover:shadow-cyan-500/5">
              <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover/card:bg-cyan-500 group-hover/card:text-white transition-all duration-500">
                <Crown size={20} className="group-hover/card:scale-110 transition-transform" />
              </div>
              <div>
                <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest leading-none">Architect / Lead</span>
                <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">Nirmal Kumar</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { role: 'Systems Eng.:', name: 'Tanishq', icon: <Code size={12} className="text-blue-500" /> },
                { role: 'UX Visionary:', name: 'Taniya Singla', icon: <PenTool size={12} className="text-purple-500" /> },
                { role: 'Security & Q:', name: 'Tanisha Dua', icon: <Cpu size={12} className="text-emerald-500" /> }
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 px-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    {member.icon}
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{member.role}</span>
                  </div>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Help Hub */}
          <div className="flex flex-col items-center lg:items-end">
            <button className="w-16 h-16 rounded-full bg-cyan-500 text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group/help relative">
              <div className="absolute inset-0 rounded-full border border-cyan-500 animate-[ping_3s_ease-in-out_infinite] opacity-30"></div>
              <HelpCircle size={28} className="group-hover/help:rotate-12 transition-transform" />
            </button>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">Security Hub</span>
          </div>
        </div>

        {/* Dynamic Legal Stat Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5 opacity-40">
          <p className="text-[9px] font-mono tracking-tighter text-slate-500">© 2024 PRICPULSE_PROTO_V4.0 // ALL_RIGHTS_RESERVED</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {['Architecture', 'Payloads', 'Terms', 'Privacy'].map((item) => (
              <button key={item} className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-500 transition-colors">{item}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
