/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Undo, Redo, Maximize, Minimize } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isFullscreen?: boolean;
}

const MenuButton = ({ onClick, isActive = false, children, title }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title: string }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "p-2 rounded-md transition-all",
      isActive 
        ? "bg-gray-900 text-white shadow-sm" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...', isFullscreen }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] sm:min-h-[600px] text-lg lg:text-xl leading-relaxed font-serif italic px-4 sm:px-0',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className={cn(
      "flex flex-col bg-transparent transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-50 p-8 lg:p-16 bg-editorial-bg overflow-y-auto" : ""
    )}>
      <div className={cn(
        "flex flex-wrap items-center gap-1 transition-all mb-4 lg:mb-8 shadow-sm",
        isFullscreen 
          ? "bg-white border border-editorial-border rounded-lg p-2 lg:p-4 max-w-4xl mx-auto w-full sticky top-0 z-50 shadow-xl" 
          : "sticky top-16 bg-white z-20 p-1 lg:p-2 border border-editorial-border rounded shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      )}>
        <div className="flex items-center gap-0.5 lg:gap-1 flex-wrap">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          
          <div className="w-px h-5 lg:h-6 bg-gray-200 mx-1" />

          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          
          <div className="w-px h-5 lg:h-6 bg-gray-200 mx-1" />

          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
        </div>

        <div className="flex-1 min-w-[8px]" />

        <div className="flex items-center gap-0.5 lg:gap-1">
          <MenuButton 
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo size={16} className="lg:w-[18px] lg:h-[18px]" />
          </MenuButton>
        </div>
      </div>

      <div className={cn(
        "flex-1",
        isFullscreen ? "max-w-3xl mx-auto w-full py-16" : ""
      )}>
        {editor && editor.isEmpty && (
        <div className="absolute top-[88px] left-4 sm:left-0 text-editorial-muted font-serif italic text-lg lg:text-xl opacity-30 pointer-events-none">
          {placeholder || "The story begins here... Let your thoughts crystallize."}
        </div>
      )}
      <EditorContent editor={editor} />
      </div>

      {!isFullscreen && (
         <div className="hidden sm:flex px-4 py-2 border-t border-gray-100 justify-end text-xs text-gray-400 font-mono">
            {editor.getText().length} UTF-8 Characters
         </div>
      )}
    </div>
  );
}
