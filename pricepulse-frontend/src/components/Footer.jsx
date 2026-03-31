import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Code2, PenTool, BugPlay, Crown, Instagram, MessageCircle, X } from 'lucide-react';

const Footer = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <footer className="mt-12 bg-white/40 dark:bg-[#0f1115]/40 backdrop-blur-2xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-visible group transition-colors duration-500">
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

        {/* Team Members Grid & Help Icon */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
          
          <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 md:gap-8 border-r-0 lg:border-r border-slate-200 dark:border-white/10 pr-0 lg:pr-8">
            {/* Team Leader */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }} 
              className="flex items-center gap-3 bg-white/60 dark:bg-[#161920]/80 p-3 md:p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all cursor-crosshair"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Crown size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Team Leader</p>
                <p className="text-sm font-black text-slate-800 dark:text-white bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-colors">Nirmal Kumar</p>
              </div>
            </motion.div>

            {/* Members */}
            <div className="flex flex-col gap-3 justify-center">
              {[
                { role: "Dev", name: "Tanishq", icon: <Code2 size={14}/>, color: "text-blue-500", groupColor: "group-hover:text-blue-500" },
                { role: "Design", name: "Taniya Singla", icon: <PenTool size={14}/>, color: "text-pink-500", groupColor: "group-hover:text-pink-500" },
                { role: "Test", name: "Tanisha Dua", icon: <BugPlay size={14}/>, color: "text-emerald-500", groupColor: "group-hover:text-emerald-500" }
              ].map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ x: 5 }} 
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <span className={`${member.color} group-hover:scale-110 transition-transform`}>{member.icon}</span>
                  <p className={`text-xs font-semibold text-slate-700 dark:text-slate-300 ${member.groupColor} transition-colors`}>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">{member.role}:</span> {member.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Inline Help Icon with Contact Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-2 relative"
          >
            <motion.button 
              whileHover={{ scale: 1.1, rotate: showHelp ? 0 : 15 }} 
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-[0_10px_40px_rgba(34,211,238,0.4)] flex items-center justify-center text-white relative overflow-hidden group"
              onClick={() => setShowHelp(!showHelp)}
            >
              <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
              {showHelp ? <X size={24} className="relative z-10" /> : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              )}
            </motion.button>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Help</span>

            <AnimatePresence>
              {showHelp && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute bottom-[110%] md:right-0 mb-4 w-[280px] bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] z-50 overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                  <h3 className="text-[15px] font-black tracking-tight text-slate-800 dark:text-white mb-4">Contact Team Support</h3>
                  
                  <div className="space-y-4">
                    {/* Nirmal Contact */}
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 transition-colors hover:border-cyan-500/30">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Crown size={12} className="text-cyan-500"/> Nirmal (Lead)</p>
                      <div className="flex gap-2">
                        <a href="https://wa.me/919060067232" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-100/50 hover:bg-emerald-200/50 text-emerald-700 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 py-2.5 rounded-xl text-[10px] font-bold transition-all hover:scale-[1.03]">
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                        <a href="https://instagram.com/nirmalgupta.vx" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-pink-100/50 hover:bg-pink-200/50 text-pink-700 dark:bg-pink-500/10 dark:hover:bg-pink-500/20 dark:text-pink-400 py-2.5 rounded-xl text-[10px] font-bold transition-all hover:scale-[1.03]">
                          <Instagram size={14} /> Insta
                        </a>
                      </div>
                    </div>

                    {/* Tanishq Contact */}
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 transition-colors hover:border-cyan-500/30">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Code2 size={12} className="text-blue-500"/> Tanishq (Dev)</p>
                      <div className="flex gap-2">
                        <a href="https://wa.me/919991182725" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-100/50 hover:bg-emerald-200/50 text-emerald-700 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 py-2.5 rounded-xl text-[10px] font-bold transition-all hover:scale-[1.03]">
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                        <a href="https://instagram.com/tanishq_1718_" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-pink-100/50 hover:bg-pink-200/50 text-pink-700 dark:bg-pink-500/10 dark:hover:bg-pink-500/20 dark:text-pink-400 py-2.5 rounded-xl text-[10px] font-bold transition-all hover:scale-[1.03]">
                          <Instagram size={14} /> Insta
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
