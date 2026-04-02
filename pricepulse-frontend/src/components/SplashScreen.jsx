import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const team = [
  { name: 'Nirmal Kumar',  role: 'Architect / Team Leader', color: '#22d3ee', delay: 0.8 },
  { name: 'Tanishq',       role: 'Lead Systems Engineer',   color: '#60a5fa', delay: 1.0 },
  { name: 'Taniya Singla', role: 'UX Visionary',            color: '#f472b6', delay: 1.2 },
  { name: 'Tanisha Dua',   role: 'Security & Quality',      color: '#34d399', delay: 1.4 },
];

const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    // Stage-managed timing for "High Power" feel
    const timerOut = setTimeout(() => setPhase('out'), 4200);
    const timerDone = setTimeout(() => onDone(), 5200);
    return () => { clearTimeout(timerOut); clearTimeout(timerDone); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash-v2"
          initial={{ opacity: 1 }}
          animate={phase === 'out' ? { 
            scale: 1.1, 
            filter: 'blur(20px)',
            opacity: 0,
            transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] }
          } : { opacity: 1 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#02040a]"
        >
          {/* HIGH-POWER BACKGROUND ENGINE */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Deep Pulse Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.1, 0.12, 0.1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmax] h-[100vmax] blur-[80px]" 
              style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)', willChange: 'transform, opacity' }}
            />
            
            {/* Scanning Line */}
            <motion.div 
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[1px] bg-cyan-500/30 z-10"
              style={{ willChange: 'top' }}
            />

            {/* Matrix-style Backdrop Grid */}
            <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

            {/* Particle Dust Animation (Optimized count) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
               {[...Array(8)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ 
                     x: Math.random() * window.innerWidth, 
                     y: Math.random() * window.innerHeight,
                     opacity: 0 
                   }}
                   animate={{ 
                     y: [null, -60],
                     opacity: [0, 0.2, 0],
                   }}
                   transition={{ 
                     duration: 4 + Math.random() * 2, 
                     repeat: Infinity, 
                     delay: Math.random() * 1 
                   }}
                   className="absolute w-1 h-1 bg-cyan-500/40 rounded-full"
                   style={{ willChange: 'transform, opacity' }}
                 />
               ))}
            </div>
          </div>

          {/* MAIN CONTENT CORE */}
          <div className="relative z-20 flex flex-col items-center">
            
            {/* Logo Power-Up */}
            <div className="relative mb-12">
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-[2px] shadow-[0_0_50px_rgba(34,211,238,0.4)]"
              >
                <div className="w-full h-full bg-[#050810] rounded-[calc(2rem-2px)] flex items-center justify-center relative overflow-hidden">
                   <motion.div 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" 
                   />
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
                     <motion.path 
                       d="M22 12h-4l-3 9L9 3l-3 9H2" 
                       stroke="currentColor" 
                       strokeWidth="2.5" 
                       strokeLinecap="round" 
                       strokeLinejoin="round" 
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                     />
                   </svg>
                </div>
              </motion.div>
              
              {/* Logo Glow Ring */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-[2rem] border border-cyan-500/50 blur-sm"
              />
            </div>

            {/* Title with decoding feel */}
            <div className="text-center mb-16 overflow-hidden">
               <motion.h1
                 initial={{ y: 100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                 className="text-6xl md:text-8xl font-black tracking-tighter text-white animate-glitch"
               >
                 PRICE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 italic">PULSE</span>
               </motion.h1>
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 1, delay: 1 }}
                 className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-2"
               />
               <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 0.6 }}
                 transition={{ delay: 1.2 }}
                 className="text-[10px] font-bold tracking-[0.5em] text-cyan-200 mt-4 uppercase"
               >
                 The smarter way to shop
               </motion.p>
            </div>

            {/* High-Power Team Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: member.delay, ease: "easeOut" }}
                  className="relative group overflow-hidden bg-[#0c0f16] border border-white/10 p-4 rounded-2xl hover:border-white/20 transition-all"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="absolute top-0 right-0 p-2 opacity-20">
                    <div className="w-8 h-8 rounded-full border border-white/20" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: member.color }}>
                    {member.role}
                  </p>
                  <h3 className="text-xl font-black text-white mt-1 group-hover:tracking-wider transition-all duration-300">
                    {member.name}
                  </h3>
                  <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-500"
                    style={{ width: '0%', backgroundColor: member.color }}
                  />
                  <motion.div 
                    animate={{ width: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: member.delay }}
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{ backgroundColor: member.color, opacity: 0.4 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Bottom Tech Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="mt-16 flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Made with ❤️ by <span className="text-cyan-500">Pokemon Team</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
