/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-editorial-divider rounded-full"
        />
        
        {/* Inner Pulsing Circle */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 bg-editorial-sidebar rounded-full shadow-inner"
        />

        {/* The "Pen" Nib Symbol */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4.5 9V22H19.5V9L12 2Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-serif italic font-bold tracking-tight text-editorial-text leading-none">Micro Book</span>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-editorial-accent leading-none mt-1">Builder</span>
      </div>
    </div>
  );
}
