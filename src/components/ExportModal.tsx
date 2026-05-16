/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book } from '../types.ts';
import { X, Download, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils.ts';

interface ExportModalProps {
  book: Book;
  onClose: () => void;
}

export default function ExportModal({ book, onClose }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [includeCover, setIncludeCover] = useState(true);
  const [includeTOC, setIncludeTOC] = useState(true);

  const generatePDF = async () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
      });

      let pageCount = 1;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);

      // --- Cover Page ---
      if (includeCover) {
        doc.setFont('times', 'bold');
        doc.setFontSize(40);
        const titleLines = doc.splitTextToSize(book.title, contentWidth);
        doc.text(titleLines, pageWidth / 2, 80, { align: 'center' });
        
        doc.setFont('times', 'normal');
        doc.setFontSize(14);
        doc.text('Written with Micro Book Builder', pageWidth / 2, 250, { align: 'center' });
        
        if (book.description) {
           doc.setFontSize(16);
           const descLines = doc.splitTextToSize(book.description, contentWidth);
           doc.text(descLines, pageWidth / 2, 120, { align: 'center' });
        }
        
        doc.addPage();
        pageCount++;
      }

      // --- Table of Contents ---
      if (includeTOC) {
        doc.setFont('times', 'bold');
        doc.setFontSize(24);
        doc.text('Table of Contents', margin, margin + 10);
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        
        book.chapters.forEach((chapter, index) => {
          const yPos = 50 + (index * 10);
          doc.text(chapter.title, margin, yPos);
          doc.text('.........', margin + doc.getTextWidth(chapter.title) + 2, yPos);
          // Simple estimation of page numbers for now since we haven't rendered chapters yet
        });
        
        doc.addPage();
        pageCount++;
      }

      // --- Chapters ---
      book.chapters.forEach((chapter, index) => {
        doc.setFont('times', 'bold');
        doc.setFontSize(20);
        doc.text(chapter.title, margin, margin + 10);
        
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        
        // Strip HTML and format content
        const cleanContent = chapter.content
          .replace(/<p>/g, '\n\n')
          .replace(/<\/p>/g, '')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<\/?[^>]+(>|$)/g, "");
          
        const lines = doc.splitTextToSize(cleanContent, contentWidth);
        doc.text(lines, margin, 45);
        
        if (index < book.chapters.length - 1) {
          doc.addPage();
          pageCount++;
        }
      });

      // Add page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }

      doc.save(`${book.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-editorial-text/20 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-editorial-bg border border-editorial-border rounded-lg w-full max-w-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-y-auto max-h-[90vh]"
      >
        <div className="p-6 lg:p-8 border-b border-editorial-divider flex justify-between items-center bg-editorial-sidebar/30 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <div className="text-[9px] lg:text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent mb-1">Final Process</div>
            <h2 className="text-xl lg:text-2xl font-serif italic text-editorial-text">Prepare Manuscript</h2>
          </div>
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-editorial-muted hover:text-editorial-text transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={14} />
            Back
          </button>
        </div>

        <div className="p-6 lg:p-10">
          <div className="space-y-8 lg:space-y-10">
            <div>
              <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-ultra-editorial text-editorial-accent block mb-4 lg:mb-6">Binding Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <button 
                  onClick={() => setFormat('pdf')}
                  className={cn(
                    "flex flex-col items-center gap-3 lg:gap-4 p-6 lg:p-8 rounded border transition-all text-center",
                    format === 'pdf' ? "border-editorial-text bg-white shadow-md ring-1 ring-editorial-text" : "border-editorial-border hover:border-editorial-accent bg-editorial-sidebar/20"
                  )}
                >
                  <FileText size={28} className={format === 'pdf' ? "text-editorial-text" : "text-editorial-muted"} />
                  <div>
                    <div className="font-bold text-[9px] lg:text-[10px] tracking-widest uppercase">Archival PDF</div>
                    <div className="text-[8px] lg:text-[9px] text-editorial-muted uppercase mt-1">Universal Access</div>
                  </div>
                </button>
                <div className="flex flex-col items-center justify-center gap-3 lg:gap-4 p-6 lg:p-8 rounded border border-editorial-border/50 bg-editorial-sidebar/10 opacity-40 cursor-not-allowed text-center">
                  <FileText size={28} className="text-editorial-muted" />
                   <div>
                    <div className="font-bold text-[9px] lg:text-[10px] tracking-widest uppercase text-editorial-muted">Digital EPUB</div>
                    <div className="text-[8px] lg:text-[9px] text-editorial-muted uppercase mt-1">Soon</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4">
               <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-ultra-editorial text-editorial-accent block mb-3 lg:mb-4">Structure Options</label>
               <label className="flex items-center gap-3 lg:gap-4 cursor-pointer group p-3 lg:p-4 bg-white border border-editorial-border rounded hover:bg-editorial-sidebar transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeCover} 
                    onChange={e => setIncludeCover(e.target.checked)}
                    className="w-4 h-4 lg:w-5 lg:h-5 rounded-sm border-editorial-border text-editorial-text focus:ring-editorial-text shrink-0"
                  />
                   <div>
                     <span className="text-[11px] lg:text-xs font-bold tracking-widest uppercase text-editorial-text block">Title Page</span>
                     <span className="text-[9px] lg:text-[10px] text-editorial-muted italic">Formal opening</span>
                   </div>
               </label>
               <label className="flex items-center gap-3 lg:gap-4 cursor-pointer group p-3 lg:p-4 bg-white border border-editorial-border rounded hover:bg-editorial-sidebar transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeTOC} 
                    onChange={e => setIncludeTOC(e.target.checked)}
                    className="w-4 h-4 lg:w-5 lg:h-5 rounded-sm border-editorial-border text-editorial-text focus:ring-editorial-text shrink-0"
                  />
                  <div>
                    <span className="text-[11px] lg:text-xs font-bold tracking-widest uppercase text-editorial-text block">Directory</span>
                    <span className="text-[9px] lg:text-[10px] text-editorial-muted italic">Auto-generated</span>
                  </div>
               </label>
            </div>
          </div>

          <button 
            onClick={generatePDF}
            disabled={isExporting}
            className="w-full bg-editorial-text text-white py-4 lg:py-5 rounded font-bold text-[9px] lg:text-[10px] tracking-[0.3em] uppercase mt-10 lg:mt-12 hover:bg-black disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            {isExporting ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Download size={18} />
                </motion.div>
                Preparing Manuscript...
              </>
            ) : (
              <>
                <Download size={18} />
                Generate Manuscript
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-4 font-mono uppercase">
            Pure Authorial Control | Ready for Publishing
          </p>
        </div>
      </motion.div>
    </div>
  );
}
