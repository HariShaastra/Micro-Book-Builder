/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CoverConfig, CoverStyleTemplate, Book } from '../types.ts';
import { Palette, Image, Type, AlignLeft, AlignCenter, AlignRight, Check, Upload, Sparkles } from 'lucide-react';

interface CoverBuilderProps {
  book: Book;
  onUpdateCover: (cover: CoverConfig) => void;
}

const TEMPLATE_PRESETS: { id: CoverStyleTemplate; name: string; bg: string; text: string; accent: string; font: string }[] = [
  { id: 'children', name: 'Children\'s Illustrated', bg: '#1B4332', text: '#FFFFFF', accent: '#D8F3DC', font: 'font-serif' },
  { id: 'fiction', name: 'Literary Fiction', bg: '#2B1B17', text: '#FAF0E6', accent: '#D4AF37', font: 'font-serif' },
  { id: 'academic', name: 'Academic Treatise', bg: '#1E3A8A', text: '#FFFFFF', accent: '#F59E0B', font: 'font-serif' },
  { id: 'minimal', name: 'Minimal Editorial', bg: '#FDFBD4', text: '#38240D', accent: '#C05800', font: 'font-serif' },
  { id: 'business', name: 'Business & Strategy', bg: '#0F172A', text: '#F8FAFC', accent: '#38BDF8', font: 'font-sans' },
  { id: 'report', name: 'Institutional Report', bg: '#312E81', text: '#FFFFFF', accent: '#A5B4FC', font: 'font-sans' },
  { id: 'modern', name: 'Contemporary Monograph', bg: '#18181B', text: '#FAFAFA', accent: '#F43F5E', font: 'font-mono' }
];

export default function CoverBuilder({ book, onUpdateCover }: CoverBuilderProps) {
  const currentCover: CoverConfig = book.cover || {
    title: book.title,
    subtitle: book.subtitle || '',
    author: book.authorName || 'Author',
    bgColor: '#1B4332',
    textColor: '#FFFFFF',
    accentColor: '#D8F3DC',
    styleTemplate: 'children',
    alignment: 'center',
    borderStyle: 'ornate'
  };

  const [title, setTitle] = useState(currentCover.title || book.title);
  const [subtitle, setSubtitle] = useState(currentCover.subtitle || book.subtitle || '');
  const [author, setAuthor] = useState(currentCover.author || book.authorName || 'Author');
  const [bgColor, setBgColor] = useState(currentCover.bgColor || '#1B4332');
  const [textColor, setTextColor] = useState(currentCover.textColor || '#FFFFFF');
  const [accentColor, setAccentColor] = useState(currentCover.accentColor || '#D8F3DC');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>(currentCover.alignment || 'center');
  const [borderStyle, setBorderStyle] = useState<'none' | 'simple' | 'ornate' | 'modern'>(currentCover.borderStyle || 'ornate');
  const [bgImage, setBgImage] = useState<string | undefined>(currentCover.bgImage || book.coverImage);

  const applyChanges = (updates: Partial<CoverConfig>) => {
    const updated: CoverConfig = {
      ...currentCover,
      title,
      subtitle,
      author,
      bgColor,
      textColor,
      accentColor,
      alignment,
      borderStyle,
      bgImage,
      ...updates
    };
    onUpdateCover(updated);
  };

  const selectPreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setBgColor(preset.bg);
    setTextColor(preset.text);
    setAccentColor(preset.accent);
    applyChanges({
      bgColor: preset.bg,
      textColor: preset.text,
      accentColor: preset.accent,
      styleTemplate: preset.id
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setBgImage(url);
      applyChanges({ bgImage: url });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Controls */}
      <div className="lg:col-span-6 space-y-6 bg-white p-6 rounded-xl border border-editorial-border shadow-xs">
        <div>
          <h3 className="text-base font-serif italic font-bold text-editorial-text mb-1">Cover Style Presets</h3>
          <p className="text-xs text-editorial-muted mb-4">Choose a typographical aesthetic designed for publishing.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TEMPLATE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`p-2.5 rounded border text-left text-xs transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  bgColor === preset.bg
                    ? 'border-editorial-accent ring-2 ring-editorial-accent/20 font-bold'
                    : 'border-editorial-border/60 hover:bg-neutral-50'
                }`}
                style={{ backgroundColor: preset.bg, color: preset.text }}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">{preset.name}</span>
                <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: preset.accent }} />
              </button>
            ))}
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-4 pt-4 border-t border-editorial-divider">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
              Title on Cover
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                applyChanges({ title: e.target.value });
              }}
              className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded px-3 py-2 text-sm font-serif italic outline-none focus:border-editorial-accent"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-muted block mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                applyChanges({ subtitle: e.target.value });
              }}
              className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded px-3 py-2 text-sm font-serif italic outline-none focus:border-editorial-accent"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
              Author Moniker
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                applyChanges({ author: e.target.value });
              }}
              className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded px-3 py-2 text-sm outline-none focus:border-editorial-accent"
            />
          </div>
        </div>

        {/* Colors & Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-editorial-divider">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-2">
              Color Palette
            </label>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-[10px] text-editorial-muted block">Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    applyChanges({ bgColor: e.target.value });
                  }}
                  className="w-8 h-8 rounded border border-editorial-border cursor-pointer p-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-editorial-muted block">Text</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    applyChanges({ textColor: e.target.value });
                  }}
                  className="w-8 h-8 rounded border border-editorial-border cursor-pointer p-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-editorial-muted block">Accent</label>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => {
                    setAccentColor(e.target.value);
                    applyChanges({ accentColor: e.target.value });
                  }}
                  className="w-8 h-8 rounded border border-editorial-border cursor-pointer p-0.5"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-2">
              Text Alignment
            </label>
            <div className="flex items-center gap-1 bg-editorial-sidebar/40 border border-editorial-border p-1 rounded-md w-fit">
              <button
                type="button"
                onClick={() => {
                  setAlignment('left');
                  applyChanges({ alignment: 'left' });
                }}
                className={`p-1.5 rounded ${alignment === 'left' ? 'bg-white shadow-xs text-editorial-accent font-bold' : 'text-editorial-muted'}`}
                title="Left Align"
              >
                <AlignLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setAlignment('center');
                  applyChanges({ alignment: 'center' });
                }}
                className={`p-1.5 rounded ${alignment === 'center' ? 'bg-white shadow-xs text-editorial-accent font-bold' : 'text-editorial-muted'}`}
                title="Center Align"
              >
                <AlignCenter size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setAlignment('right');
                  applyChanges({ alignment: 'right' });
                }}
                className={`p-1.5 rounded ${alignment === 'right' ? 'bg-white shadow-xs text-editorial-accent font-bold' : 'text-editorial-muted'}`}
                title="Right Align"
              >
                <AlignRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Background Image Upload */}
        <div className="pt-4 border-t border-editorial-divider">
          <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-2">
            Cover Background Image (Optional)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-editorial-border rounded text-xs font-bold uppercase tracking-wider text-editorial-text hover:bg-neutral-50 cursor-pointer shadow-xs">
              <Upload size={14} />
              <span>Select File</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {bgImage && (
              <button
                onClick={() => {
                  setBgImage(undefined);
                  applyChanges({ bgImage: undefined });
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Live Preview Column */}
      <div className="lg:col-span-6 flex flex-col items-center sticky top-6">
        <div className="text-[10px] font-mono uppercase tracking-widest text-editorial-muted mb-3 font-bold">
          Live Cover Render • 6" × 9" Trade Ratio
        </div>

        {/* Rendered Book Cover Card */}
        <div
          className="relative w-full max-w-[340px] aspect-[2/3] rounded-lg shadow-2xl overflow-hidden flex flex-col justify-between p-8 border transition-all"
          style={{
            backgroundColor: bgColor,
            color: textColor,
            borderColor: accentColor,
            backgroundImage: bgImage ? `url(${bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: alignment
          }}
        >
          {/* Subtle vignette layer if image exists */}
          {bgImage && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-0" />
          )}

          {/* Border Frame */}
          {borderStyle === 'ornate' && (
            <div
              className="absolute inset-3 border-2 border-dashed pointer-events-none rounded opacity-60 z-10"
              style={{ borderColor: accentColor }}
            />
          )}
          {borderStyle === 'simple' && (
            <div
              className="absolute inset-3 border pointer-events-none rounded opacity-40 z-10"
              style={{ borderColor: accentColor }}
            />
          )}

          {/* Top Banner / Category */}
          <div className="relative z-10">
            <span
              className="text-[9px] font-mono uppercase tracking-[0.3em] font-bold block"
              style={{ color: accentColor }}
            >
              {book.publisher || 'Shaastra Publishing'}
            </span>
          </div>

          {/* Center Titles */}
          <div className="relative z-10 my-auto py-6 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-serif italic font-bold leading-tight drop-shadow-xs">
              {title || 'Untitled Manuscript'}
            </h1>
            {subtitle && (
              <p
                className="text-xs sm:text-sm font-serif italic leading-relaxed opacity-90 drop-shadow-xs"
                style={{ color: accentColor }}
              >
                {subtitle}
              </p>
            )}
            <div
              className="w-12 h-0.5 mx-auto opacity-75 my-2"
              style={{
                backgroundColor: accentColor,
                marginLeft: alignment === 'left' ? '0' : alignment === 'right' ? 'auto' : 'auto',
                marginRight: alignment === 'right' ? '0' : alignment === 'left' ? 'auto' : 'auto'
              }}
            />
          </div>

          {/* Bottom Author */}
          <div className="relative z-10 pt-4">
            <p className="text-[10px] font-mono tracking-widest uppercase opacity-75">By</p>
            <p className="text-xs sm:text-sm font-serif font-bold tracking-wide">
              {author || 'Author'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
