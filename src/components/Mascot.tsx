/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, MessageSquare, X } from 'lucide-react';

import { useNotification } from '../contexts/NotificationContext';

const TIPS = [
  "True writing is an act of architecture. Define your boundaries.",
  "Symmetry in structure leads to clarity in thought.",
  "The 'Resource Repository' is your intellectual evidence locker.",
  "A manuscript is never finished, only abandoned at the right moment.",
  "Privacy is the ultimate luxury for a modern writer.",
  "Every book is a conversation with a future reader.",
  "Focus on the rhythm of your prose. Let the studio handle the rest.",
];

export default function Mascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('micro-book-user-name') || '');
  const { notify } = useNotification();

  useEffect(() => {
    // Show a notification after a short delay
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNameSave = (name: string) => {
    setUserName(name);
    localStorage.setItem('micro-book-user-name', name);
    window.dispatchEvent(new Event('storage'));
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
    notify('The Archivist has shared a new reflection.', 'info');
  };

  return (
    <div className="fixed bottom-0 right-0 p-6 lg:p-10 z-[100] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-72 lg:w-80 bg-editorial-sidebar border border-editorial-border p-6 rounded shadow-2xl mb-4 pointer-events-auto"
          >
            <div className="flex justify-between items-start mb-6">
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

            <div className="mb-6 space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-editorial-accent">Studio Personalization</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Your Name..."
                  className="flex-1 bg-white border border-editorial-divider rounded px-3 py-2 text-xs font-serif italic focus:ring-1 focus:ring-editorial-text outline-none transition-all shadow-inner"
                  value={userName}
                  onChange={(e) => handleNameSave(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative group/msg">
              <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-editorial-text scale-y-0 group-hover/msg:scale-y-100 transition-transform" />
              <div className="bg-white/80 p-4 rounded border border-editorial-divider shadow-sm group-hover/msg:shadow-md transition-all">
                <p className="text-sm font-serif italic leading-relaxed text-editorial-text">
                  "{TIPS[currentTip]}"
                </p>
              </div>
            </div>

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

      <div className="flex items-center gap-4 pointer-events-auto">
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-editorial-border py-2 px-4 rounded shadow-sm whitespace-nowrap hidden lg:block"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent">A letter for you...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className="bg-editorial-text text-white flex items-center gap-4 shadow-2xl hover:bg-black transition-all rounded py-4 px-6 lg:px-8 border border-editorial-border/20 group"
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-70 group-hover:opacity-100 transition-opacity">Studio</span>
            <span className="text-[9px] font-medium uppercase tracking-widest leading-none opacity-40">Companion</span>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <MessageSquare size={20} />
        </motion.button>
      </div>
    </div>
  );
}
