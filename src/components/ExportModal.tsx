/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book } from '../types.ts';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ChevronLeft, 
  FileCode, 
  FileSpreadsheet, 
  AlignLeft 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { cn } from '../lib/utils.ts';

interface ExportModalProps {
  book: Book;
  onClose: () => void;
}

export default function ExportModal({ book, onClose }: ExportModalProps) {
  const { notify } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'docx' | 'markdown' | 'txt'>('pdf');
  const [includeCover, setIncludeCover] = useState(true);
  const [includeTOC, setIncludeTOC] = useState(true);
  const [includeReferences, setIncludeReferences] = useState(true);

  const cleanText = (html: string) => {
    return html
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n> $1\n\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const sanitizedFilename = (book.title || 'Manuscript').replace(/[^a-zA-Z0-9_-]/g, '_');

      if (format === 'pdf') {
        const doc = new jsPDF({
          unit: 'mm',
          format: 'a4',
        });

        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (margin * 2);

        // --- Cover Page ---
        if (includeCover) {
          doc.setFont('times', 'bold');
          doc.setFontSize(32);
          const titleLines = doc.splitTextToSize(book.title, contentWidth);
          doc.text(titleLines, pageWidth / 2, 75, { align: 'center' });

          if (book.subtitle) {
            doc.setFont('times', 'italic');
            doc.setFontSize(14);
            const subLines = doc.splitTextToSize(book.subtitle, contentWidth);
            doc.text(subLines, pageWidth / 2, 110, { align: 'center' });
          }

          doc.setFont('times', 'normal');
          doc.setFontSize(14);
          doc.text(`By ${book.authorName || 'Author'}`, pageWidth / 2, 160, { align: 'center' });

          doc.setFontSize(11);
          doc.setFont('times', 'italic');
          doc.text(book.publisher || 'Published with Book Builder Shaastra', pageWidth / 2, 250, { align: 'center' });

          doc.addPage();
        }

        // --- Table of Contents ---
        if (includeTOC) {
          doc.setFont('times', 'bold');
          doc.setFontSize(22);
          doc.text('Table of Contents', margin, margin + 10);
          doc.setFont('times', 'normal');
          doc.setFontSize(12);

          book.chapters.forEach((chapter, index) => {
            const yPos = 45 + (index * 10);
            if (yPos < 270) {
              doc.text(`${index + 1}. ${chapter.title}`, margin, yPos);
              doc.text(`p. ${index * 4 + 5}`, pageWidth - margin - 15, yPos);
            }
          });

          doc.addPage();
        }

        // --- Chapters ---
        book.chapters.forEach((chapter, index) => {
          doc.setFont('times', 'bold');
          doc.setFontSize(18);
          doc.text(`Chapter ${index + 1}: ${chapter.title}`, margin, margin + 10);

          doc.setFont('times', 'normal');
          doc.setFontSize(11);

          const plainContent = cleanText(chapter.content);
          const lines = doc.splitTextToSize(plainContent, contentWidth);
          doc.text(lines, margin, 42);

          if (index < book.chapters.length - 1) {
            doc.addPage();
          }
        });

        // --- References ---
        if (includeReferences && book.references && book.references.length > 0) {
          doc.addPage();
          doc.setFont('times', 'bold');
          doc.setFontSize(18);
          doc.text('References & Bibliography', margin, margin + 10);

          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          let refY = 40;
          book.references.forEach((ref, i) => {
            const refText = `${i + 1}. ${ref.author} (${ref.year || 'n.d.'}). ${ref.title}. ${ref.publisher || ref.url || ''}`;
            const refLines = doc.splitTextToSize(refText, contentWidth);
            doc.text(refLines, margin, refY);
            refY += refLines.length * 6 + 4;
          });
        }

        // Add page numbers
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setFont('times', 'normal');
          doc.text(`Page ${i}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }

        doc.save(`${sanitizedFilename}.pdf`);
        notify('Manuscript PDF successfully generated.', 'success');
      } else if (format === 'docx') {
        const paragraphs: Paragraph[] = [
          new Paragraph({
            text: book.title,
            heading: HeadingLevel.TITLE
          }),
          new Paragraph({
            text: book.subtitle || '',
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Author: ${book.authorName || 'Author'}`,
                italics: true
              })
            ]
          })
        ];

        book.chapters.forEach((ch, idx) => {
          paragraphs.push(
            new Paragraph({
              text: `Chapter ${idx + 1}: ${ch.title}`,
              heading: HeadingLevel.HEADING_1
            })
          );
          const body = cleanText(ch.content);
          body.split('\n\n').forEach(p => {
            if (p.trim()) {
              paragraphs.push(new Paragraph({ text: p.trim() }));
            }
          });
        });

        if (includeReferences && book.references && book.references.length > 0) {
          paragraphs.push(
            new Paragraph({
              text: 'References & Citations',
              heading: HeadingLevel.HEADING_1
            })
          );
          book.references.forEach((ref, idx) => {
            paragraphs.push(
              new Paragraph({
                text: `${idx + 1}. ${ref.author} (${ref.year || 'n.d.'}). ${ref.title}. ${ref.publisher || ''}`
              })
            );
          });
        }

        const docxDoc = new Document({
          sections: [{ properties: {}, children: paragraphs }]
        });

        const blob = await Packer.toBlob(docxDoc);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${sanitizedFilename}.docx`;
        link.click();
        URL.revokeObjectURL(link.href);
        notify('Word Document (.docx) generated.', 'success');
      } else if (format === 'markdown') {
        let md = `# ${book.title}\n\n`;
        if (book.subtitle) md += `*${book.subtitle}*\n\n`;
        md += `**Author:** ${book.authorName || 'Author'}\n\n`;
        md += `**Publisher:** ${book.publisher || 'Book Builder Shaastra'}\n\n`;
        md += `---\n\n`;

        book.chapters.forEach((ch, idx) => {
          md += `## Chapter ${idx + 1}: ${ch.title}\n\n`;
          md += `${cleanText(ch.content)}\n\n---\n\n`;
        });

        if (includeReferences && book.references && book.references.length > 0) {
          md += `## References\n\n`;
          book.references.forEach((ref, i) => {
            md += `${i + 1}. **${ref.author}** (${ref.year || 'n.d.'}). *${ref.title}*. ${ref.publisher || ref.url || ''}\n`;
          });
        }

        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${sanitizedFilename}.md`;
        link.click();
        URL.revokeObjectURL(link.href);
        notify('Markdown document (.md) downloaded.', 'success');
      } else {
        // Plain text
        let txt = `${book.title.toUpperCase()}\n`;
        if (book.subtitle) txt += `${book.subtitle}\n`;
        txt += `By ${book.authorName || 'Author'}\n\n`;
        txt += `============================================================\n\n`;

        book.chapters.forEach((ch, idx) => {
          txt += `CHAPTER ${idx + 1}: ${ch.title.toUpperCase()}\n\n`;
          txt += `${cleanText(ch.content)}\n\n`;
          txt += `------------------------------------------------------------\n\n`;
        });

        if (includeReferences && book.references && book.references.length > 0) {
          txt += `REFERENCES & BIBLIOGRAPHY\n\n`;
          book.references.forEach((ref, i) => {
            txt += `[${i + 1}] ${ref.author} (${ref.year || 'n.d.'}). ${ref.title}. ${ref.publisher || ''}\n`;
          });
        }

        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${sanitizedFilename}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
        notify('Plain Text document (.txt) downloaded.', 'success');
      }
    } catch (err) {
      console.error('Export failure:', err);
      notify('Failed to generate export file. Please try another format.', 'error');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-editorial-bg border border-editorial-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-editorial-divider flex justify-between items-center bg-editorial-sidebar/30">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-editorial-accent mb-1">
              Publishing & Distribution
            </div>
            <h2 className="text-xl font-serif italic text-editorial-text font-bold">
              Export Manuscript
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-3">
              Choose Document Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={cn(
                  "p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition-all cursor-pointer",
                  format === 'pdf'
                    ? "border-editorial-accent bg-white shadow-xs ring-2 ring-editorial-accent/20"
                    : "border-editorial-border bg-white/40 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <FileText size={20} className="text-red-700" />
                  <span className="text-[9px] font-mono uppercase bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">PDF</span>
                </div>
                <div>
                  <div className="font-bold text-xs">Archival PDF</div>
                  <div className="text-[10px] text-editorial-muted">Print & universal reading</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('docx')}
                className={cn(
                  "p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition-all cursor-pointer",
                  format === 'docx'
                    ? "border-editorial-accent bg-white shadow-xs ring-2 ring-editorial-accent/20"
                    : "border-editorial-border bg-white/40 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <FileSpreadsheet size={20} className="text-blue-700" />
                  <span className="text-[9px] font-mono uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">DOCX</span>
                </div>
                <div>
                  <div className="font-bold text-xs">Word Document</div>
                  <div className="text-[10px] text-editorial-muted">Editable in Word / Docs</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('markdown')}
                className={cn(
                  "p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition-all cursor-pointer",
                  format === 'markdown'
                    ? "border-editorial-accent bg-white shadow-xs ring-2 ring-editorial-accent/20"
                    : "border-editorial-border bg-white/40 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <FileCode size={20} className="text-purple-700" />
                  <span className="text-[9px] font-mono uppercase bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">MD</span>
                </div>
                <div>
                  <div className="font-bold text-xs">Markdown</div>
                  <div className="text-[10px] text-editorial-muted">For blogs, GitHub, static sites</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={cn(
                  "p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition-all cursor-pointer",
                  format === 'txt'
                    ? "border-editorial-accent bg-white shadow-xs ring-2 ring-editorial-accent/20"
                    : "border-editorial-border bg-white/40 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <AlignLeft size={20} className="text-emerald-700" />
                  <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">TXT</span>
                </div>
                <div>
                  <div className="font-bold text-xs">Plain Text</div>
                  <div className="text-[10px] text-editorial-muted">Pure distraction-free copy</div>
                </div>
              </button>
            </div>
          </div>

          {/* Options checkboxes */}
          <div className="space-y-3 pt-3 border-t border-editorial-divider">
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
              Inclusion Options
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border border-editorial-border rounded cursor-pointer hover:bg-neutral-50">
              <input
                type="checkbox"
                checked={includeCover}
                onChange={e => setIncludeCover(e.target.checked)}
                className="w-4 h-4 rounded text-editorial-accent"
              />
              <div>
                <span className="text-xs font-bold block text-editorial-text">Title & Cover Page</span>
                <span className="text-[10px] text-editorial-muted">Include formal title block and author attribution</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-editorial-border rounded cursor-pointer hover:bg-neutral-50">
              <input
                type="checkbox"
                checked={includeTOC}
                onChange={e => setIncludeTOC(e.target.checked)}
                className="w-4 h-4 rounded text-editorial-accent"
              />
              <div>
                <span className="text-xs font-bold block text-editorial-text">Table of Contents</span>
                <span className="text-[10px] text-editorial-muted">Include generated directory of chapters</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-editorial-border rounded cursor-pointer hover:bg-neutral-50">
              <input
                type="checkbox"
                checked={includeReferences}
                onChange={e => setIncludeReferences(e.target.checked)}
                className="w-4 h-4 rounded text-editorial-accent"
              />
              <div>
                <span className="text-xs font-bold block text-editorial-text">References & Citations</span>
                <span className="text-[10px] text-editorial-muted">Append bibliographic citations at the end</span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-editorial-divider bg-editorial-sidebar/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-editorial-muted hover:text-editorial-text"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-editorial-text text-white hover:bg-black px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating Document...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
