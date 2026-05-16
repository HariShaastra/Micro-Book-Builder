/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Ornate Symmetrical Background Layers */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[0.5px] border-editorial-text/5 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-[0.5px] border-editorial-accent/10 rounded-full border-dashed"
        />
        
        {/* Glow and Energy Layers */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 bg-editorial-accent/20 blur-2xl rounded-full"
        />

        {/* Central Symmetrical Kinetic Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="relative z-10 text-editorial-text"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Central Pillar */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M12 4V20" 
              stroke="url(#logo-glow)" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
            />

            {/* Symmetrical Spreads (The "Pages" or "Wings") */}
            {[4, 6, 8].map((y, i) => (
              <React.Fragment key={i}>
                <motion.path
                  animate={{ 
                    d: [
                      `M12 ${y}C6 ${y} 4 ${y+4} 4 ${y+8}C4 ${y+10} 12 ${y+12} 12 ${y+12}`,
                      `M12 ${y}C5 ${y} 3 ${y+4} 3 ${y+8}C3 ${y+10} 12 ${y+12} 12 ${y+12}`,
                      `M12 ${y}C6 ${y} 4 ${y+4} 4 ${y+8}C4 ${y+10} 12 ${y+12} 12 ${y+12}`
                    ]
                  }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity={0.6 - i * 0.15}
                />
                <motion.path
                  animate={{ 
                    d: [
                      `M12 ${y}C18 ${y} 20 ${y+4} 20 ${y+8}C20 ${y+10} 12 ${y+12} 12 ${y+12}`,
                      `M12 ${y}C19 ${y} 21 ${y+4} 21 ${y+8}C21 ${y+10} 12 ${y+12} 12 ${y+12}`,
                      `M12 ${y}C18 ${y} 20 ${y+4} 20 ${y+8}C20 ${y+10} 12 ${y+12} 12 ${y+12}`
                    ]
                  }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity={0.6 - i * 0.15}
                />
              </React.Fragment>
            ))}

            <motion.circle 
              animate={{ r: [1.5, 2.5, 1.5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              cx="12" cy="3" r="2" fill="currentColor" 
            />
          </svg>
        </motion.div>

        {/* Orbiting Elements */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-editorial-accent rounded-full"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-editorial-divider" />
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-serif italic font-bold tracking-tight text-editorial-text">Micro</span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-editorial-accent">Book</span>
          </div>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-editorial-divider" />
        </div>
        
        <div className="relative mt-1 py-1 px-8 overflow-hidden group">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-editorial-accent/10 to-transparent skew-x-12"
          />
          <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-editorial-muted relative z-10 transition-colors group-hover:text-editorial-text">Builder</span>
        </div>

        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-4 flex items-center gap-4"
        >
          <div className="w-1.5 h-[1px] bg-editorial-accent" />
          <span className="text-[8px] font-medium tracking-[0.5em] uppercase text-editorial-accent/60 whitespace-nowrap">Distinction in Writing</span>
          <div className="w-1.5 h-[1px] bg-editorial-accent" />
        </motion.div>
      </div>
    </div>
  );
}
