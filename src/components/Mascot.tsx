/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, MessageSquare, X } from 'lucide-react';

const TIPS = [
  "Each chapter is a step in the journey. Focus on the structure before the flourish.",
  "Your words are your own. No machine has touched this manuscript.",
  "Use the 'Outline' mode to glimpse the forest while you're deep in the trees.",
  "A good book starts with a single paragraph. Don't rush the process.",
  "Export often to see how your manuscript feels as a physical object.",
  "The 'Structure' view is for your architect mind. The 'Writing' view is for your soul.",
  "Remember: Micro Book Builder is a pure studio. You are the only intelligence here.",
];

export default function Mascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show a notification after a short delay
    const timer = setTimeout(() => setShowNotification(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-editorial-sidebar border border-editorial-border p-6 rounded-lg shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-editorial-text text-white rounded-full flex items-center justify-center font-serif italic text-lg shadow-inner">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-editorial-text">The Archivist</h4>
                  <p className="text-[9px] text-editorial-accent uppercase tracking-widest">Writing Companion</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-editorial-muted hover:text-editorial-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-sm font-serif italic leading-relaxed text-editorial-text mb-6 border-l-2 border-editorial-divider pl-4">
              "{TIPS[currentTip]}"
            </p>

            <div className="flex justify-between items-center bg-white/50 p-2 rounded border border-editorial-divider">
              <p className="text-[9px] font-bold uppercase tracking-widest text-editorial-muted">Studio Tip {currentTip + 1}/{TIPS.length}</p>
              <button 
                onClick={nextTip}
                className="text-[9px] font-bold uppercase tracking-widest text-editorial-text hover:underline"
              >
                Next Thought
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-16 top-1/2 -translate-y-1/2 bg-white border border-editorial-border py-1 px-3 rounded shadow-md whitespace-nowrap"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent">A letter for you...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className="w-14 h-14 bg-editorial-text text-white rounded-full flex items-center justify-center shadow-xl hover:bg-black transition-colors"
        >
          <MessageSquare size={24} />
        </motion.button>
      </div>
    </div>
  );
}
