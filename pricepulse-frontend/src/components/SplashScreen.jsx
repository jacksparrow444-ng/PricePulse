import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const team = [
  { name: 'Nirmal Kumar',  role: 'Team Leader',  color: '#22d3ee', delay: 0.1 },
  { name: 'Tanishq',       role: 'Developer',    color: '#60a5fa', delay: 0.25 },
  { name: 'Taniya Singla', role: 'Designer',     color: '#f472b6', delay: 0.4 },
  { name: 'Tanisha Dua',   role: 'QA Tester',    color: '#34d399', delay: 0.55 },
];

const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('in');   // 'in' → 'hold' → 'out'

  useEffect(() => {
    // Phase 1: show team names → Phase 2: slide out
    const t1 = setTimeout(() => setPhase('out'), 2600);
    const t2 = setTimeout(() => onDone(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          animate={phase === 'out' ? { y: '-100%' } : { y: 0 }}
          transition={
            phase === 'out'
              ? { duration: 0.72, ease: [0.76, 0, 0.24, 1] }
              : {}
          }
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#050810' }}
        >
          {/* Glowing orb background */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                width: '60vw', height: '60vw',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '40vw', height: '40vw',
                top: '30%', left: '60%',
                background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8">

            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-[0_0_40px_rgba(34,211,238,0.5)]"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
            </motion.div>

            {/* PricePulse title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-2"
            >
              <h1
                className="font-black tracking-tight leading-none"
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  background: 'linear-gradient(135deg, #fff 40%, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PricePulse<span style={{ WebkitTextFillColor: '#22d3ee' }}>.</span>
              </h1>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.4em] mt-1"
                style={{ color: 'rgba(148,163,184,0.7)' }}
              >
                Advanced Hyperlocal Intelligence
              </p>
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="my-6 h-px w-48"
              style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)' }}
            />

            {/* Pokemon Team label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="text-[9px] font-black uppercase tracking-[0.5em] mb-5"
              style={{ color: 'rgba(148,163,184,0.5)' }}
            >
              Presented by
            </motion.p>

            {/* Team members stagger-in */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: member.delay, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between px-5 py-3 rounded-2xl border"
                  style={{
                    background: `${member.color}0f`,
                    borderColor: `${member.color}30`,
                  }}
                >
                  <div className="text-left">
                    <p className="font-black text-white text-sm">{member.name}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `${member.color}99` }}>
                      {member.role}
                    </p>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: member.color,
                      boxShadow: `0 0 8px ${member.color}`,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pokemon Team badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75, duration: 0.4 }}
              className="mt-6 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.3em]"
              style={{
                borderColor: 'rgba(34,211,238,0.3)',
                color: 'rgba(34,211,238,0.7)',
                background: 'rgba(34,211,238,0.05)',
              }}
            >
              🎮 Pokemon Team
            </motion.div>
          </div>

          {/* Bottom slide-out hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 0 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
            style={{ color: 'rgba(148,163,184,0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            <span className="text-[8px] font-bold uppercase tracking-widest">Loading</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
