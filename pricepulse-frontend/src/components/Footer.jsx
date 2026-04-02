import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Crown, Code, PenTool, Cpu, X, MessageCircle, Instagram } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const Footer = () => {
  const [showContact, setShowContact] = useState(false);
  const { theme } = usePrice();
  const isDark = theme === 'dark';

  return (
    <footer className="mt-12 relative z-50">
      <div className={`glass-panel rounded-2xl px-7 py-8 relative`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px]
          ${isDark
            ? 'bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent'
            : 'bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent'
          }`} />

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg
                ${isDark
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/20'
                }`}>
                <Activity size={18} className="animate-pulse" />
              </div>
              <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                PricePulse <span className={isDark ? 'text-cyan-500' : 'text-indigo-500'}>.</span>
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Know before you buy. Real prices, reported by real people.
            </p>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-bold
              ${isDark
                ? 'bg-white/5 border-white/10 text-slate-500'
                : 'bg-white/60 border-slate-200 text-slate-400'
              }`}>
              Made with <Heart size={9} className="text-rose-500 fill-rose-500 animate-pulse" /> by Pokemon Team
            </div>
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 max-w-lg px-4 lg:px-8">
            <div className={`p-3 rounded-xl flex items-center gap-3 border transition-all group/c
              ${isDark
                ? 'bg-white/5 border-white/5 hover:border-cyan-500/20'
                : 'bg-white/70 border-slate-200/60 hover:border-indigo-200'
              }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border
                ${isDark ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-200'}`}>
                <Crown size={16} className={isDark ? 'text-cyan-400' : 'text-indigo-500'} />
              </div>
              <div>
                <p className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-500/70' : 'text-indigo-500/70'}`}>
                  Team Lead
                </p>
                <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-700'}`}>Nirmal Kumar</p>
              </div>
            </div>

            {[
              { role: 'Developer', name: 'Tanishq', Icon: Code, color: isDark ? 'text-blue-400' : 'text-blue-600' },
              { role: 'Designer', name: 'Taniya Singla', Icon: PenTool, color: isDark ? 'text-pink-400' : 'text-pink-600' },
              { role: 'QA / Testing', name: 'Tanisha Dua', Icon: Cpu, color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
            ].map((m, i) => (
              <div key={i} className={`p-3 rounded-xl flex items-center gap-3 border
                ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/70 border-slate-200/60'}`}>
                <m.Icon size={14} className={m.color} />
                <div>
                  <p className={`text-[8px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{m.role}</p>
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{m.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Us button */}
          <div className="flex flex-col items-center gap-2 relative">
            <button
              onClick={() => setShowContact(!showContact)}
              className={`w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95
                ${isDark
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-400/30'
                }`}
            >
              {showContact ? <X size={22} /> : <MessageCircle size={22} />}
            </button>
            <span className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Contact Us
            </span>

            {/* Contact panel */}
            <AnimatePresence>
              {showContact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  className={`absolute bottom-full right-0 mb-5 w-[270px] rounded-2xl p-5 shadow-2xl z-[100] border
                    ${isDark
                      ? 'bg-[#0f1115]/95 border-white/10 backdrop-blur-2xl shadow-black/40'
                      : 'bg-white/95 border-indigo-100 backdrop-blur-2xl shadow-indigo-100/80'
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl
                    ${isDark
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                      : 'bg-gradient-to-r from-indigo-500 to-violet-600'
                    }`} />
                  <h4 className={`text-sm font-black mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Get in Touch
                  </h4>

                  <div className="space-y-3">
                    {[
                      { name: 'Nirmal (Lead)', Icon: Crown, wa: 'https://wa.me/919060067232', ig: 'https://instagram.com/nirmalgupta.vx', color: isDark ? 'text-cyan-400' : 'text-indigo-600' },
                      { name: 'Tanishq (Dev)', Icon: Code, wa: 'https://wa.me/919991182725', ig: 'https://instagram.com/tanishq_1718_', color: isDark ? 'text-blue-400' : 'text-blue-600' },
                    ].map((person) => (
                      <div key={person.name} className={`p-3 rounded-xl border
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${person.color}`}>
                          <person.Icon size={10} /> {person.name}
                        </p>
                        <div className="flex gap-2">
                          <a href={person.wa} target="_blank" rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.03]
                              bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                          <a href={person.ig} target="_blank" rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.03]
                              bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <Instagram size={12} /> Instagram
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-8 pt-5 border-t flex flex-col md:flex-row justify-between items-center gap-3 opacity-50
          ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <p className={`text-[9px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            © 2024 PricePulse · Pokemon Team
          </p>
          <div className="flex items-center gap-5">
            {['About', 'How It Works', 'Terms', 'Privacy'].map((item) => (
              <button key={item} className={`text-[9px] font-bold hover:opacity-100 transition-opacity
                ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
