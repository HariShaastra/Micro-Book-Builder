/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Extension, Mark, Node, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Highlighter,
  Strikethrough,
  Code,
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3, 
  Undo, 
  Redo, 
  Table as TableIcon, 
  Box, 
  Link2, 
  Minus, 
  ChevronDown,
  Plus,
  Trash2,
  RemoveFormatting,
  Asterisk,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Search,
  Type,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { PageBorderStyle } from '../types.ts';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isFullscreen?: boolean;
  onOpenCiteLinkModal?: () => void;
  onOpenFindReplace?: () => void;
  onImagePasted?: (image: { name: string; url: string; size: number }) => void;
  borderStyle?: PageBorderStyle;
  pageSize?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  title,
  disabled = false
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode; 
  title: string; 
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
    className={cn(
      "p-1.5 sm:p-2 rounded-md transition-all cursor-pointer text-xs flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shrink-0",
      isActive 
        ? "bg-editorial-accent text-white shadow-xs font-bold dark:bg-amber-600 dark:text-white" 
        : "text-editorial-muted dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-800 hover:text-editorial-text dark:hover:text-white"
    )}
  >
    {children}
  </button>
);

const CustomUnderline = Mark.create({
  name: 'underline',
  parseHTML() {
    return [
      { tag: 'u' },
      { style: 'text-decoration=underline' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['u', mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleUnderline: () => ({ commands }: any) => {
        return commands.toggleMark(this.name);
      },
      setUnderline: () => ({ commands }: any) => {
        return commands.setMark(this.name);
      },
      unsetUnderline: () => ({ commands }: any) => {
        return commands.unsetMark(this.name);
      },
    } as any;
  },
});

const CustomHighlight = Mark.create({
  name: 'highlight',
  parseHTML() {
    return [
      { tag: 'mark' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleHighlight: () => ({ commands }: any) => {
        return commands.toggleMark(this.name);
      },
      setHighlight: () => ({ commands }: any) => {
        return commands.setMark(this.name);
      },
      unsetHighlight: () => ({ commands }: any) => {
        return commands.unsetMark(this.name);
      },
    } as any;
  },
});

const CalloutBox = Node.create({
  name: 'calloutBox',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,
  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => {
          const classList = element.getAttribute('class') || '';
          if (classList.includes('callout-warning')) return 'warning';
          if (classList.includes('callout-tip')) return 'tip';
          if (classList.includes('callout-quote')) return 'quote';
          if (classList.includes('callout-note')) return 'note';
          if (classList.includes('callout-takeaway')) return 'takeaway';
          return element.getAttribute('data-type') || 'info';
        },
        renderHTML: attributes => ({
          'data-type': attributes.type,
          class: `callout-box callout-${attributes.type}`,
        }),
      },
    };
  },
  parseHTML() {
    return [
      { tag: 'div.callout-box' },
      { tag: 'div[data-type]' },
      { tag: 'blockquote.callout-box' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomTextAlign = Extension.create({
  name: 'textAlign',
  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: element => element.style.textAlign || this.options.defaultAlignment,
            renderHTML: attributes => {
              if (!attributes.textAlign || attributes.textAlign === this.options.defaultAlignment) {
                return {};
              }
              return { style: `text-align: ${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextAlign: (alignment: string) => ({ commands }: any) => {
        if (!this.options.alignments.includes(alignment)) {
          return false;
        }
        return this.options.types.every((type: string) => commands.updateAttributes(type, { textAlign: alignment }));
      },
      unsetTextAlign: () => ({ commands }: any) => {
        return this.options.types.every((type: string) => commands.resetAttributes(type, 'textAlign'));
      },
    } as any;
  },
});

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Draft your manuscript here...', 
  isFullscreen, 
  onOpenCiteLinkModal,
  onOpenFindReplace,
  onImagePasted,
  borderStyle = 'none',
  pageSize = 'A4'
}: RichTextEditorProps) {
  const [showStylesMenu, setShowStylesMenu] = useState(false);
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [customRows, setCustomRows] = useState(3);
  const [customCols, setCustomCols] = useState(3);
  const [showCustomTableModal, setShowCustomTableModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CustomUnderline,
      CustomHighlight,
      CalloutBox,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editorial-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      CustomTextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg border border-editorial-border my-6 shadow-sm mx-auto block',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[550px] sm:min-h-[650px] text-lg lg:text-xl leading-relaxed font-serif px-2 sm:px-6 py-4 select-text',
      },
      handleDOMEvents: {
        paste: (view, event) => {
          const items = Array.from(event.clipboardData?.items || []);
          const imageItem = items.find(item => item.type.startsWith('image/'));
          if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
                if (onImagePasted) {
                  onImagePasted({ name: file.name, url: src, size: file.size });
                }
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
          return false;
        },
      },
    },
  });

  // Non-conflicting Alt+... keyboard shortcuts for MS Word-like typography
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '0') {
          e.preventDefault();
          editor.chain().focus().setParagraph().run();
        } else if (e.key === '1') {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        } else if (e.key === '2') {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        } else if (e.key === '3') {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        } else if (e.key === 'u' || e.key === 'U') {
          e.preventDefault();
          editor.chain().focus().toggleMark('underline').run();
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          editor.chain().focus().toggleMark('highlight').run();
        } else if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          (editor.chain().focus() as any).setTextAlign('left').run();
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          (editor.chain().focus() as any).setTextAlign('center').run();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          (editor.chain().focus() as any).setTextAlign('right').run();
        } else if (e.key === 'j' || e.key === 'J') {
          e.preventDefault();
          (editor.chain().focus() as any).setTextAlign('justify').run();
        } else if ((e.key === 'f' || e.key === 'F') && onOpenFindReplace) {
          e.preventDefault();
          onOpenFindReplace();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, onOpenFindReplace]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  // Insert Word-like Table with editable cells
  const insertWordTable = (rows = 3, cols = 3) => {
    try {
      (editor.chain().focus() as any).insertTable({ rows, cols, withHeaderRow: true }).run();
    } catch {
      let tableHtml = '<table class="editorial-table"><thead><tr>';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<th>Column Header ${c}</th>`;
      }
      tableHtml += '</tr></thead><tbody>';
      for (let r = 1; r <= rows; r++) {
        tableHtml += '<tr>';
        for (let c = 1; c <= cols; c++) {
          tableHtml += `<td>Row ${r}, Col ${c}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table><p></p>';
      editor.chain().focus().insertContent(tableHtml).run();
    }
    setShowTableMenu(false);
    setShowCustomTableModal(false);
  };

  // Insert Word-like Callout Box
  const insertCalloutBox = (type: 'info' | 'warning' | 'tip' | 'quote' | 'note' | 'takeaway') => {
    let icon = '💡';
    let label = 'Note';
    let contentPlaceholder = 'Enter your focused instruction, reference, or reflection here.';

    if (type === 'warning') { 
      icon = '⚠️'; 
      label = 'Caution'; 
      contentPlaceholder = 'Enter critical warning or disclaimer details.';
    }
    if (type === 'tip') { 
      icon = '✨'; 
      label = 'Pro-Tip'; 
      contentPlaceholder = 'Enter an actionable tip or reader recommendation.';
    }
    if (type === 'quote') { 
      icon = '“'; 
      label = 'Key Reflection'; 
      contentPlaceholder = 'Enter a poignant quote, proverb, or conceptual highlight.';
    }
    if (type === 'note') { 
      icon = '📌'; 
      label = 'Important Note'; 
      contentPlaceholder = 'Enter essential context or editorial commentary.';
    }
    if (type === 'takeaway') {
      icon = '✓';
      label = 'Key Takeaways';
      contentPlaceholder = 'Summary points or bulleted review items for this section.';
    }

    const boxHtml = `<div data-type="${type}" class="callout-box callout-${type}"><p><strong>${icon} ${label}:</strong> ${contentPlaceholder}</p></div><p></p>`;
    editor.chain().focus().insertContent(boxHtml).run();
    setShowBoxMenu(false);
  };

  // Insert Scene Break / Asterism
  const insertSceneBreak = () => {
    const breakHtml = `<p style="text-align: center; letter-spacing: 0.5em; margin: 2rem 0; font-size: 1.25rem;">* * *</p><p></p>`;
    editor.chain().focus().insertContent(breakHtml).run();
  };

  // Indentation Handlers
  const handleIndent = () => {
    if (!editor) return;
    if (editor.can().sinkListItem('listItem')) {
      editor.chain().focus().sinkListItem('listItem').run();
    } else {
      document.execCommand('indent', false);
      onChange(editor.getHTML());
    }
  };

  const handleOutdent = () => {
    if (!editor) return;
    if (editor.can().liftListItem('listItem')) {
      editor.chain().focus().liftListItem('listItem').run();
    } else {
      document.execCommand('outdent', false);
      onChange(editor.getHTML());
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-transparent transition-all duration-300 relative w-full max-w-full overflow-x-hidden",
      isFullscreen ? "fixed inset-0 z-50 p-6 lg:p-14 bg-editorial-bg dark:bg-stone-950 overflow-y-auto" : ""
    )}>
      {/* ========================================================================= */}
      {/* MICROSOFT WORD-LIKE EDITING TOOLBAR RIBBON */}
      {/* Dedicated fixed place above the manuscript sheet - zero freezing over text */}
      {/* ========================================================================= */}
      <div className="mb-4 bg-editorial-sidebar dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-xl p-2 sm:p-2.5 flex flex-wrap items-center gap-1 shadow-xs static z-10 w-full max-w-full shrink-0">
        
        {/* Microsoft Word Style Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStylesMenu(!showStylesMenu)}
            className="h-8 px-2.5 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-editorial-accent text-editorial-text dark:text-stone-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors shrink-0"
            title="Word Styles Gallery (Alt+0, Alt+1, Alt+2, Alt+3)"
          >
            <Type size={13} className="text-editorial-accent dark:text-amber-400" />
            <span className="font-serif">
              {editor.isActive('heading', { level: 1 })
                ? 'Heading 1'
                : editor.isActive('heading', { level: 2 })
                ? 'Heading 2'
                : editor.isActive('heading', { level: 3 })
                ? 'Heading 3'
                : 'Normal (Prose)'}
            </span>
            <ChevronDown size={11} className="text-editorial-muted dark:text-stone-400" />
          </button>

          {showStylesMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowStylesMenu(false)} 
              />
              <div className="absolute left-0 top-9 w-60 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded-xl shadow-xl p-1.5 z-50 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-muted dark:text-stone-400 border-b border-editorial-divider dark:border-stone-700">
                  Microsoft Word Styles
                </div>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setShowStylesMenu(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                    editor.isActive('paragraph') && !editor.isActive('heading')
                      ? "bg-editorial-sidebar dark:bg-stone-700 text-editorial-accent dark:text-amber-300 font-bold"
                      : "hover:bg-editorial-sidebar/60 dark:hover:bg-stone-700/60 text-editorial-text dark:text-stone-100"
                  )}
                >
                  <div>
                    <div className="font-serif text-sm">Normal</div>
                    <div className="text-[10px] text-editorial-muted dark:text-stone-400 font-sans">Body paragraph text (Alt+0)</div>
                  </div>
                  {editor.isActive('paragraph') && !editor.isActive('heading') && <Check size={13} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setShowStylesMenu(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                    editor.isActive('heading', { level: 1 })
                      ? "bg-editorial-sidebar dark:bg-stone-700 text-editorial-accent dark:text-amber-300 font-bold"
                      : "hover:bg-editorial-sidebar/60 dark:hover:bg-stone-700/60 text-editorial-text dark:text-stone-100"
                  )}
                >
                  <div>
                    <div className="font-serif text-base font-bold text-editorial-text dark:text-stone-100">Heading 1</div>
                    <div className="text-[10px] text-editorial-muted dark:text-stone-400 font-sans">Main chapter & title (Alt+1)</div>
                  </div>
                  {editor.isActive('heading', { level: 1 }) && <Check size={13} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setShowStylesMenu(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                    editor.isActive('heading', { level: 2 })
                      ? "bg-editorial-sidebar dark:bg-stone-700 text-editorial-accent dark:text-amber-300 font-bold"
                      : "hover:bg-editorial-sidebar/60 dark:hover:bg-stone-700/60 text-editorial-text dark:text-stone-100"
                  )}
                >
                  <div>
                    <div className="font-serif text-sm font-semibold text-editorial-text dark:text-stone-100">Heading 2</div>
                    <div className="text-[10px] text-editorial-muted dark:text-stone-400 font-sans">Major section heading (Alt+2)</div>
                  </div>
                  {editor.isActive('heading', { level: 2 }) && <Check size={13} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setShowStylesMenu(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                    editor.isActive('heading', { level: 3 })
                      ? "bg-editorial-sidebar dark:bg-stone-700 text-editorial-accent dark:text-amber-300 font-bold"
                      : "hover:bg-editorial-sidebar/60 dark:hover:bg-stone-700/60 text-editorial-text dark:text-stone-100"
                  )}
                >
                  <div>
                    <div className="font-serif text-xs font-semibold text-editorial-text dark:text-stone-100">Heading 3</div>
                    <div className="text-[10px] text-editorial-muted dark:text-stone-400 font-sans">Minor subsection (Alt+3)</div>
                  </div>
                  {editor.isActive('heading', { level: 3 }) && <Check size={13} />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Quick Headings Buttons */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph') && !editor.isActive('heading')}
            title="Normal Paragraph Text (Alt+0)"
          >
            <span className="font-serif font-bold text-xs px-1">P</span>
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1 (Alt+1)"
          >
            <Heading1 size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2 (Alt+2)"
          >
            <Heading2 size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3 (Alt+3)"
          >
            <Heading3 size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider dark:bg-stone-700 mx-1 shrink-0" />

        {/* Text Formats: Bold, Italic, Underline, Highlight, Strikethrough, Code */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Alt+B)"
          >
            <Bold size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Alt+I)"
          >
            <Italic size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => (editor.chain().focus() as any).toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Alt+U)"
          >
            <UnderlineIcon size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => (editor.chain().focus() as any).toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight Text (Alt+M)"
          >
            <Highlighter size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Monospace Code"
          >
            <Code size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider dark:bg-stone-700 mx-1 shrink-0" />

        {/* Left, Center, Right, Balanced / Justify Alignment & Indent Options */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => (editor.chain().focus() as any).setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left (Ctrl+Shift+L)"
          >
            <AlignLeft size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => (editor.chain().focus() as any).setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center (Ctrl+Shift+E)"
          >
            <AlignCenter size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => (editor.chain().focus() as any).setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right (Ctrl+Shift+R)"
          >
            <AlignRight size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => (editor.chain().focus() as any).setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Balanced Justify (Balanced text alignment with neat margins)"
          >
            <AlignJustify size={15} />
          </MenuButton>

          {/* Indent & Outdent */}
          <MenuButton 
            onClick={handleOutdent}
            title="Decrease Indent / Outdent"
          >
            <Outdent size={15} />
          </MenuButton>
          <MenuButton 
            onClick={handleIndent}
            title="Increase Indent"
          >
            <Indent size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider mx-1" />

        {/* Lists & Dividers */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bulleted List"
          >
            <List size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus size={15} />
          </MenuButton>
          <MenuButton 
            onClick={insertSceneBreak}
            title="Scene Break Asterism (* * *)"
          >
            <Asterisk size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider mx-1" />

        {/* Word-like Tables Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowTableMenu(!showTableMenu);
              setShowBoxMenu(false);
            }}
            className="px-2.5 py-1.5 rounded hover:bg-white text-editorial-text text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer border border-transparent"
            title="Insert Word-like Table"
          >
            <TableIcon size={14} />
            <span className="hidden sm:inline">Table</span>
            <ChevronDown size={11} />
          </button>

          {showTableMenu && (
            <div className="absolute left-0 mt-1 w-56 bg-white border border-editorial-border rounded-lg shadow-xl p-2 z-50 space-y-1 text-xs font-sans">
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-editorial-muted border-b border-editorial-divider">
                Word-like Table Presets
              </div>
              <button
                type="button"
                onClick={() => insertWordTable(2, 2)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>2 × 2 Simple Grid</span>
                <span className="text-[10px] font-mono text-editorial-muted">4 cells</span>
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(3, 3)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>3 × 3 Standard Table</span>
                <span className="text-[10px] font-mono text-editorial-muted">9 cells</span>
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(4, 3)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>4 × 3 Comparison Table</span>
                <span className="text-[10px] font-mono text-editorial-muted">12 cells</span>
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(5, 4)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>5 × 4 Research Matrix</span>
                <span className="text-[10px] font-mono text-editorial-muted">20 cells</span>
              </button>

              <div className="pt-1 border-t border-editorial-divider">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomTableModal(true);
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-accent font-bold flex items-center gap-1.5"
                >
                  <Grid size={13} />
                  <span>Custom Rows & Cols...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Word-like Callout Boxes Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowBoxMenu(!showBoxMenu);
              setShowTableMenu(false);
            }}
            className="px-2.5 py-1.5 rounded hover:bg-white text-editorial-text text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            title="Insert Word-like Box / Callout"
          >
            <Box size={14} />
            <span className="hidden sm:inline">Boxes</span>
            <ChevronDown size={11} />
          </button>

          {showBoxMenu && (
            <div className="absolute left-0 mt-1 w-56 bg-white border border-editorial-border rounded-lg shadow-xl p-2 z-50 space-y-1 text-xs font-sans">
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-editorial-muted border-b border-editorial-divider">
                Word-Style Callout Boxes
              </div>
              <button
                type="button"
                onClick={() => insertCalloutBox('info')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 text-blue-900 flex items-center gap-2"
              >
                <span>💡</span>
                <span>Info Callout Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('tip')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-emerald-900 flex items-center gap-2"
              >
                <span>✨</span>
                <span>Tip / Insight Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('warning')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-amber-900 flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>Caution / Alert Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('quote')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-editorial-accent flex items-center gap-2"
              >
                <span>“</span>
                <span>Reflection Quote Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('note')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-neutral-100 text-editorial-text flex items-center gap-2"
              >
                <span>📌</span>
                <span>Framed Note Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('takeaway')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-emerald-900 flex items-center gap-2"
              >
                <span>✓</span>
                <span>Key Takeaways Box</span>
              </button>
            </div>
          )}
        </div>

        {/* Zoho-style Cite & Link Works Tool Button */}
        {onOpenCiteLinkModal && (
          <button
            type="button"
            onClick={onOpenCiteLinkModal}
            className="px-2.5 py-1.5 bg-white border border-editorial-border rounded hover:border-editorial-accent text-editorial-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Cite works or link companion manuscripts (Zoho Style)"
          >
            <Link2 size={13} />
            <span className="hidden sm:inline">Cite & Link</span>
          </button>
        )}

        {/* Word-like Find & Replace Ribbon Button */}
        {onOpenFindReplace && (
          <button
            type="button"
            onClick={onOpenFindReplace}
            className="px-2.5 py-1.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded hover:border-editorial-accent text-editorial-text dark:text-stone-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Find and replace words like MS Word (Alt+F)"
          >
            <Search size={13} className="text-editorial-accent dark:text-amber-400" />
            <span className="hidden sm:inline">Find & Replace</span>
          </button>
        )}

        {/* Dynamic Interactive Table Controls (when cursor is inside a table) */}
        {editor.isActive('table') && (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-2 py-1 rounded-md text-[11px] font-mono shrink-0">
            <span className="font-bold text-amber-900 dark:text-amber-300 mr-1 flex items-center gap-1">
              <TableIcon size={12} /> Table:
            </span>
            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).addRowAfter().run()}
              className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded hover:bg-neutral-50 dark:hover:bg-stone-700 text-editorial-text dark:text-stone-200 cursor-pointer"
              title="Add Row Below"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).deleteRow().run()}
              className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded hover:bg-neutral-50 dark:hover:bg-stone-700 text-editorial-text dark:text-stone-200 cursor-pointer"
              title="Delete Row"
            >
              - Row
            </button>
            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).addColumnAfter().run()}
              className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded hover:bg-neutral-50 dark:hover:bg-stone-700 text-editorial-text dark:text-stone-200 cursor-pointer"
              title="Add Column Right"
            >
              + Col
            </button>
            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).deleteColumn().run()}
              className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded hover:bg-neutral-50 dark:hover:bg-stone-700 text-editorial-text dark:text-stone-200 cursor-pointer"
              title="Delete Column"
            >
              - Col
            </button>
            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).deleteTable().run()}
              className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-300 rounded hover:bg-red-100 cursor-pointer"
              title="Delete Entire Table"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Clear formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear Formatting"
        >
          <RemoveFormatting size={14} />
        </MenuButton>

        {/* Undo & Redo */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={14} />
          </MenuButton>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOM TABLE MODAL */}
      {/* ========================================================================= */}
      {showCustomTableModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-editorial-border rounded-xl p-5 w-full max-w-sm space-y-4 shadow-xl select-none">
            <h4 className="font-serif italic font-bold text-base text-editorial-text">
              Insert Custom Table
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-editorial-muted font-mono mb-1">Rows:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={customRows}
                  onChange={(e) => setCustomRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border border-editorial-border rounded p-2 text-editorial-text outline-none"
                />
              </div>
              <div>
                <label className="block text-editorial-muted font-mono mb-1">Columns:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={customCols}
                  onChange={(e) => setCustomCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border border-editorial-border rounded p-2 text-editorial-text outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomTableModal(false)}
                className="px-3 py-1.5 rounded text-xs text-editorial-muted hover:text-editorial-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(customRows, customCols)}
                className="px-4 py-1.5 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text"
              >
                Insert Grid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PURE WHITE WRITING SHEET */}
      {/* Zero section guide text inside the white paper - completely pristine */}
      {/* Styled with architectural page border and trim size model */}
      {/* ========================================================================= */}
      <div className={cn(
        "flex-1 relative bg-white dark:bg-stone-900 text-editorial-text dark:text-stone-100 rounded-xl p-6 sm:p-12 shadow-xs transition-all select-text max-w-full overflow-x-hidden border border-editorial-border/60 dark:border-stone-800 mx-auto w-full",
        pageSize === 'A3' ? 'max-w-5xl' :
        pageSize === 'Letter' ? 'max-w-3xl' :
        pageSize === 'A5' ? 'max-w-xl' :
        pageSize === 'Legal' ? 'max-w-3xl' :
        pageSize === 'Trade 6x9' ? 'max-w-2xl' :
        'max-w-3xl', // A4 default
        borderStyle === 'classic-double' ? 'page-border-classic-double' :
        borderStyle === 'oxford' ? 'page-border-oxford' :
        borderStyle === 'ornate-corners' ? 'page-border-ornate-corners' :
        borderStyle === 'vintage-filigree' ? 'page-border-vintage-filigree' :
        borderStyle === 'modern-accent' ? 'page-border-modern-accent' :
        borderStyle === 'manuscript-frame' ? 'page-border-manuscript-frame' :
        borderStyle === 'none' ? 'page-border-none' :
        'page-border-classic-single',
        isFullscreen ? "py-16" : ""
      )}>
        <EditorContent editor={editor} className="select-text" />
      </div>

      {/* Bottom Character / Word Metric */}
      {!isFullscreen && (
        <div className="flex px-4 py-2 border-t border-editorial-divider justify-between text-[11px] text-editorial-muted font-mono">
          <span>Manuscript Stationery</span>
          <span>
            {editor.getText().length} Characters • {editor.getText().split(/\s+/).filter(Boolean).length} Words
          </span>
        </div>
      )}
    </div>
  );
}
