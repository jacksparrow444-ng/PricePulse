import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Crown, Code, PenTool, Cpu,
  X, MessageCircle, Instagram, ExternalLink,
  Zap
} from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const TEAM = [
  {
    role: 'Team Lead',
    name: 'Nirmal Kumar',
    Icon: Crown,
    accentDark: 'text-cyan-400',
    accentLight: 'text-indigo-600',
    borderHover: 'hover:border-indigo-300',
    wa: 'https://wa.me/919060067232',
    ig: 'https://instagram.com/nirmalgupta.vx',
  },
  {
    role: 'Developer',
    name: 'Tanishq',
    Icon: Code,
    accentDark: 'text-blue-400',
    accentLight: 'text-blue-600',
    borderHover: 'hover:border-blue-300',
    wa: 'https://wa.me/919991182725',
    ig: 'https://instagram.com/tanishq_1718_',
  },
  {
    role: 'Designer',
    name: 'Taniya Singla',
    Icon: PenTool,
    accentDark: 'text-pink-400',
    accentLight: 'text-pink-600',
    borderHover: 'hover:border-pink-300',
    wa: null,
    ig: null,
  },
  {
    role: 'QA & Testing',
    name: 'Tanisha Dua',
    Icon: Cpu,
    accentDark: 'text-emerald-400',
    accentLight: 'text-emerald-600',
    borderHover: 'hover:border-emerald-300',
    wa: null,
    ig: null,
  },
];

const TECH_STACK = ['React', 'Node.js', 'MySQL', 'Vite', 'Framer Motion'];

const NAV_LINKS = [
  { label: 'About', href: '#' },
  { label: 'How It Works', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
];

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const { theme } = usePrice();
  const isDark = theme === 'dark';

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16 relative z-50"
    >
      {/* ── MAIN FOOTER CARD ──────────────────────────────────── */}
      <div className={`rounded-3xl relative overflow-hidden
        ${isDark
          ? 'bg-gradient-to-br from-[#0d0f18] via-[#0a0c14] to-[#0d1020] border border-white/8'
          : 'bg-gradient-to-br from-white/90 via-indigo-50/60 to-purple-50/40 border border-indigo-100/80'
        }
        shadow-2xl ${isDark ? 'shadow-black/40' : 'shadow-indigo-200/40'}
      `}>

        {/* Decorative top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px]
          bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent`} />

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

        <div className="relative z-10 px-8 py-12 lg:px-12 lg:py-14">

          {/* ── TOP SECTION ─────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12">

            {/* LEFT — Brand Block */}
            <div className="flex flex-col gap-6 lg:max-w-[260px]">
              {/* Logo */}
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0
                  ${isDark
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/25'
                    : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-400/30'
                  }`}>
                  <Activity size={22} className="animate-pulse" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight leading-none
                    ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    PricePulse
                    <span className={isDark ? 'text-cyan-500' : 'text-indigo-500'}> .</span>
                  </h2>
                </div>
              </div>

              {/* Tagline */}
              <p className={`text-sm leading-relaxed font-medium
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Know before you buy. Real prices,<br className="hidden sm:block" /> reported by real people.
              </p>

              {/* Made with love badge */}
              <div className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full font-bold text-sm border
                ${isDark
                  ? 'bg-white/8 border-white/12 text-slate-300'
                  : 'bg-white border-indigo-200 text-slate-600 shadow-sm'
                }`}>
                Made with
                <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                by Pokemon Team
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-3">
                {TECH_STACK.map((tech) => (
                  <span key={tech}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border
                      ${isDark
                        ? 'bg-indigo-500/15 border-indigo-500/25 text-indigo-300'
                        : 'bg-indigo-100 border-indigo-300/60 text-indigo-700'
                      }`}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Team Grid (2×2) */}
            <div className="flex-1">
              <p className={`text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Zap size={13} /> The Team
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEAM.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-default
                      ${isDark
                        ? `bg-white/5 border-white/8 hover:border-indigo-500/40 hover:bg-white/8 hover:shadow-xl hover:shadow-indigo-900/30`
                        : `bg-white border-slate-200/80 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-100/80`
                      }
                      hover:scale-[1.03] hover:-translate-y-1
                    `}
                    style={{ transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    {/* Top: icon + links */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors
                        ${isDark
                          ? `bg-white/8 border-white/10 group-hover:border-white/20`
                          : `bg-slate-50 border-slate-200 group-hover:border-indigo-200`
                        }`}>
                        <member.Icon size={18} className={isDark ? member.accentDark : member.accentLight} />
                      </div>
                      {/* Social links */}
                      {(member.wa || member.ig) && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {member.wa && (
                            <a href={member.wa} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                              <MessageCircle size={12} />
                            </a>
                          )}
                          {member.ig && (
                            <a href={member.ig} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                              <Instagram size={12} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Role + Name */}
                    <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1
                      ${isDark ? member.accentDark : member.accentLight} opacity-70`}>
                      {member.role}
                    </p>
                    <h3 className={`text-[15px] font-black leading-tight
                      ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {member.name}
                    </h3>

                    {/* Hover border glow */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                      border-2 ${isDark ? 'border-indigo-500/35' : 'border-indigo-400/50'}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ──────────────────────────────────────── */}
          <div className={`pt-6 border-t relative
            ${isDark ? 'border-white/8' : 'border-slate-200/80'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                © 2024 PricePulse · Pokemon Team · All rights reserved
              </p>
              <div className="flex items-center gap-6">
                {NAV_LINKS.map(({ label, href }) => (
                  <a key={label} href={href}
                    className={`text-[11px] font-semibold relative group transition-colors
                      ${isDark
                        ? 'text-slate-500 hover:text-slate-200'
                        : 'text-slate-400 hover:text-indigo-600'
                      }`}>
                    {label}
                    {/* Underline animation */}
                    <span className={`absolute -bottom-0.5 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300
                      ${isDark ? 'bg-slate-200' : 'bg-indigo-500'}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING CONTACT BUTTON ───────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-center gap-2">
        <AnimatePresence>
          {showContact && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={`w-[290px] rounded-2xl shadow-2xl border overflow-hidden
                ${isDark
                  ? 'bg-[#0f1115]/97 border-white/10 backdrop-blur-2xl shadow-black/60'
                  : 'bg-white/97 border-indigo-100 backdrop-blur-2xl shadow-indigo-200/60'
                }`}
            >
              {/* Modal header stripe */}
              <div className={`h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500`} />
              <div className="p-5">
                <h4 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Get in Touch
                </h4>
                <p className={`text-[11px] mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Reach out to our team directly
                </p>
                <div className="space-y-3">
                  {TEAM.filter(m => m.wa || m.ig).map((person) => (
                    <div key={person.name}
                      className={`p-3.5 rounded-xl border
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5
                        ${isDark ? person.accentDark : person.accentLight}`}>
                        <person.Icon size={10} /> {person.name}
                      </p>
                      <div className="flex gap-2">
                        {person.wa && (
                          <a href={person.wa} target="_blank" rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:scale-[1.03] active:scale-95
                              bg-emerald-50 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                            <MessageCircle size={13} /> WhatsApp
                          </a>
                        )}
                        {person.ig && (
                          <a href={person.ig} target="_blank" rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:scale-[1.03] active:scale-95
                              bg-rose-50 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 dark:bg-rose-500/10">
                            <Instagram size={13} /> Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The floating button */}
        <div className="relative">
          {/* Pulse ring */}
          {!showContact && (
            <span className={`absolute inset-0 rounded-full animate-ping opacity-40
              ${isDark ? 'bg-cyan-500' : 'bg-indigo-500'}`} />
          )}
          {/* Notification dot */}
          {!showContact && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#050508] z-10 flex items-center justify-center">
              <span className="text-[7px] text-white font-black">2</span>
            </span>
          )}
          <button
            onClick={() => setShowContact(!showContact)}
            className={`btn-primary relative w-16 h-16 rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all
              hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
              ${isDark
                ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-cyan-500/30'
                : 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-indigo-400/40'
              }`}
            style={{ transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <AnimatePresence mode="wait">
              {showContact
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={26} />
                  </motion.span>
                : <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <MessageCircle size={26} />
                  </motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest
          ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Contact
        </span>
      </div>
    </motion.footer>
  );
}
