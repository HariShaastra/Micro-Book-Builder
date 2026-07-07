/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Undo, Redo } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isFullscreen?: boolean;
  onImagePasted?: (image: { name: string; url: string; size: number }) => void;
}

const MenuButton = ({ onClick, isActive = false, children, title }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title: string }) => (
  <button
    onClick={onClick}
    title={title}
    type="button"
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

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...', isFullscreen, onImagePasted }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] sm:min-h-[600px] text-lg lg:text-xl leading-relaxed font-serif px-4 sm:px-0',
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
        drop: (view, event) => {
          const files = Array.from(event.dataTransfer?.files || []);
          const imageFile = files.find(file => file.type.startsWith('image/'));
          if (imageFile) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = () => {
              const src = reader.result as string;
              const { schema } = view.state;
              const node = schema.nodes.image.create({ src });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
              if (onImagePasted) {
                onImagePasted({ name: imageFile.name, url: src, size: imageFile.size });
              }
            };
            reader.readAsDataURL(imageFile);
            return true;
          }
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const renderToolbarButtons = () => (
    <>
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
    </>
  );

  return (
    <div className={cn(
      "flex flex-col bg-transparent transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-50 p-8 lg:p-16 bg-editorial-bg overflow-y-auto" : ""
    )}>
      {isFullscreen ? (
        /* Floating / Sticky Toolbar in Fullscreen Mode */
        <div className="flex flex-wrap items-center gap-1 transition-all mb-4 lg:mb-8 shadow-xl bg-white border border-editorial-border rounded-lg p-2 lg:p-4 max-w-4xl mx-auto w-full sticky top-0 z-50">
          {renderToolbarButtons()}
        </div>
      ) : (
        /* Flat, non-sticky Section Guide attached toolbar in typewriter mode */
        <div className="mb-8 bg-white border border-editorial-border rounded text-left shadow-sm overflow-hidden select-none">
          <div className="p-4 bg-white">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-editorial-accent mb-1 block">✍️ Section Guide: Typewriter Mode</span>
            <p className="text-[11px] text-editorial-accent leading-relaxed font-serif italic">
              <strong>Steps:</strong> Click the chapter headline above to rename this segment (e.g. <em>"Introduction"</em>), then click onto the typewriter page below to draft your content. Every paragraph auto-saves instantly as you type. You can also directly <strong>copy & paste pictures</strong> or drop images onto the typewriter page to insert them!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1 p-1 lg:p-2 bg-editorial-sidebar border-t border-editorial-border">
            {renderToolbarButtons()}
          </div>
        </div>
      )}

      <div className={cn(
        "flex-1 relative",
        isFullscreen ? "max-w-3xl mx-auto w-full py-16" : ""
      )}>
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
