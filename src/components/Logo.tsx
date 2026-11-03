/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export default function Logo({ className = "", compact = false }: LogoProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        {/* Compact Kinetic Emblem */}
        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
          {/* Outer rotating blueprint compass ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-editorial-accent/30 border-dashed"
          />
          {/* Inner counter-rotating ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border-[0.5px] border-editorial-text/20"
          />
          {/* Subtle golden ambient glow */}
          <motion.div 
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-1.5 bg-editorial-accent/20 rounded-full blur-xs"
          />

          {/* Central Animated Open Codex Emblem */}
          <div className="relative z-10 text-editorial-accent flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Spine */}
              <motion.path 
                d="M12 4.5V19.5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              {/* Left Foliation */}
              <motion.path
                animate={{
                  d: [
                    "M12 6.5C8 4.5 4 5 2.5 6V18C4 17 8 16.5 12 18.5",
                    "M12 6.5C8 5.2 4 5.5 2.5 6.5V18.5C4 17.5 8 17.2 12 18.5",
                    "M12 6.5C8 4.5 4 5 2.5 6V18C4 17 8 16.5 12 18.5"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Foliation */}
              <motion.path
                animate={{
                  d: [
                    "M12 6.5C16 4.5 20 5 21.5 6V18C20 17 16 16.5 12 18.5",
                    "M12 6.5C16 5.2 20 5.5 21.5 6.5V18.5C20 17.5 16 17.2 12 18.5",
                    "M12 6.5C16 4.5 20 5 21.5 6V18C20 17 16 16.5 12 18.5"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Crown Diamond / Architectural Keystone */}
              <motion.circle 
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                cx="12" 
                cy="3" 
                r="1.5" 
                fill="#C05800" 
              />
            </svg>
          </div>
        </div>

        {/* Compact Title Typography */}
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span className="font-serif italic font-bold text-sm tracking-tight text-editorial-text">Book</span>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-editorial-accent">Builder</span>
          </div>
          <span className="text-[8px] font-mono font-bold tracking-[0.35em] uppercase text-editorial-muted mt-0.5">
            Shaastra
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PROMINENT HERO LOGO: RELEVANT, ANIMATED, KINETIC, GEOMETRIC SHAASTRA
  // =========================================================================
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        {/* 1. Outermost Cosmic Blueprint Coordinate Ring (Shaastra Mandalam) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-editorial-text/10"
        >
          {/* Golden Cardinal Markers (N, S, E, W) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-editorial-accent rounded-full shadow-xs" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-editorial-accent rounded-full shadow-xs" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-editorial-accent rounded-full shadow-xs" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-editorial-accent rounded-full shadow-xs" />
        </motion.div>

        {/* 2. Middle Counter-Rotating Geometric Architecture Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2.5 rounded-full border border-editorial-accent/25 border-dashed"
        />

        {/* 3. Golden Ratio Hexagram / Octagram Star Lattice */}
        <motion.div 
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border-[0.5px] border-editorial-accent/15"
          style={{
            backgroundImage: `radial-gradient(circle, transparent 60%, rgba(192, 88, 0, 0.08) 100%)`
          }}
        />

        {/* 4. Ambient Radiant Aura (Pulsing Light of Creation) */}
        <motion.div 
          animate={{ 
            scale: [0.92, 1.12, 0.92], 
            opacity: [0.25, 0.5, 0.25] 
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-editorial-accent/25 to-orange-400/20 blur-md pointer-events-none"
        />

        {/* 5. Central Dynamic Codex: Moving Folios & Architectural Keystone */}
        <div className="relative z-10 text-editorial-text drop-shadow-sm flex items-center justify-center">
          <svg width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shaastraSpine" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E57D22" />
                <stop offset="50%" stopColor="#C05800" />
                <stop offset="100%" stopColor="#873C00" />
              </linearGradient>

              <linearGradient id="goldPageGradient" x1="12" y1="16" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFDF2" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FDFBD4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#EBE5C4" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="stylusGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFC837" />
                <stop offset="100%" stopColor="#E57D22" />
              </linearGradient>
            </defs>

            {/* Central Pillar of Knowledge (The Sthambha / Codex Spine) */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d="M32 10V54" 
              stroke="url(#shaastraSpine)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />

            {/* Bottom Foundation Pedestal (The Architectural Base) */}
            <path 
              d="M26 54H38" 
              stroke="url(#shaastraSpine)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />

            {/* Layer 1: Base Open Manuscript Folios */}
            <motion.path
              d="M32 20C22 13 14 15 8 18V48C14 45 22 43 32 50C42 43 50 45 56 48V18C50 15 42 13 32 20Z"
              fill="url(#goldPageGradient)"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-editorial-border"
            />

            {/* Layer 2: Animated Turning Wings/Leaves (The Living Book) */}
            <motion.path
              animate={{
                d: [
                  "M32 17C21 11 13 13 7 16V46C13 43 21 41 32 47C43 41 51 43 57 46V16C51 13 43 11 32 17Z",
                  "M32 17C22 13 15 14 8 18V48C15 44 22 43 32 47C42 43 49 44 56 48V18C49 14 42 13 32 17Z",
                  "M32 17C21 11 13 13 7 16V46C13 43 21 41 32 47C43 41 51 43 57 46V16C51 13 43 11 32 17Z"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-editorial-text"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Manuscript Lines (Text Rows symbolizing authored content) */}
            {[26, 32, 38].map((y, idx) => (
              <React.Fragment key={idx}>
                {/* Left Page Rows */}
                <motion.line
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.3 }}
                  x1="14" y1={y} x2="26" y2={y + 1}
                  stroke="#C05800"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                {/* Right Page Rows */}
                <motion.line
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.3 + 0.2 }}
                  x1="38" y1={y + 1} x2="50" y2={y}
                  stroke="#C05800"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </React.Fragment>
            ))}

            {/* Dynamic Kinetic Stylus / Master Quill Gliding Above the Manuscript */}
            <motion.g
              animate={{
                x: [-3, 4, -3],
                y: [-2, 2, -2],
                rotate: [-6, 6, -6]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "32px 14px" }}
            >
              {/* Quill Feather Silhouette */}
              <path
                d="M32 6C34 9 37 12 36 17C35 19 33 21 32 24C31 21 29 19 28 17C27 12 30 9 32 6Z"
                fill="url(#stylusGlow)"
              />
              <circle cx="32" cy="7" r="1.5" fill="#FFFDF2" />
            </motion.g>

            {/* Floating Sparkles / Golden Ink Dust */}
            <motion.circle
              animate={{ 
                cx: [28, 30, 28], 
                cy: [22, 19, 22], 
                opacity: [0.3, 1, 0.3], 
                scale: [0.8, 1.2, 0.8] 
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              r="1.2"
              fill="#E57D22"
            />
            <motion.circle
              animate={{ 
                cx: [36, 34, 36], 
                cy: [21, 24, 21], 
                opacity: [0.3, 0.9, 0.3], 
                scale: [0.8, 1.2, 0.8] 
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              r="1.2"
              fill="#E57D22"
            />
          </svg>
        </div>

        {/* Orbiting Celestial Sparks (Wisdom in Motion) */}
        {[0, 180].map((angle, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 18 + i * 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-editorial-accent rounded-full shadow-[0_0_8px_#C05800]" />
          </motion.div>
        ))}
      </div>

      {/* Title & Brand Typography */}
      <div className="flex flex-col items-center mt-2 text-center">
        {/* Symmetric Flourish Lines */}
        <div className="flex items-center gap-3">
          <div className="h-px w-6 sm:w-12 bg-gradient-to-r from-transparent to-editorial-accent/60" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-serif italic font-bold tracking-tight text-editorial-text">
              Book
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-editorial-accent">
              Builder
            </span>
          </div>
          <div className="h-px w-6 sm:w-12 bg-gradient-to-l from-transparent to-editorial-accent/60" />
        </div>

        {/* Shaastra Golden Architectural Ribbon */}
        <div className="relative mt-1 py-0.5 px-6 overflow-hidden">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-editorial-accent/15 to-transparent skew-x-12"
          />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.55em] uppercase text-editorial-muted">
            Shaastra
          </span>
        </div>
      </div>
    </div>
  );
}
