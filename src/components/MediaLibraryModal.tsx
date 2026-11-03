/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Asset } from '../types.ts';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Search, X, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MediaLibraryModalProps {
  assets: Asset[];
  onUpdateAssets: (assets: Asset[]) => void;
  onSelectImage?: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaLibraryModal({
  assets,
  onUpdateAssets,
  onSelectImage,
  isOpen,
  onClose
}: MediaLibraryModalProps) {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        const newAsset: Asset = {
          id: uuidv4(),
          name: file.name,
          type: file.type,
          url,
          size: file.size,
          dateAdded: Date.now(),
          usageCount: 1
        };
        onUpdateAssets([...assets, newAsset]);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteAsset = (id: string) => {
    onUpdateAssets(assets.filter(a => a.id !== id));
  };

  const copyUrl = (asset: Asset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-editorial-bg border border-editorial-border rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-editorial-divider flex items-center justify-between bg-editorial-sidebar/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-editorial-sidebar flex items-center justify-center text-editorial-accent">
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic font-bold text-editorial-text">Media Library</h2>
              <p className="text-xs text-editorial-muted">Manage illustrations, diagrams, and cover images.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-editorial-divider flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-editorial-muted" />
            <input
              type="text"
              placeholder="Search images by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded pl-8 pr-3 py-1.5 text-xs outline-none focus:border-editorial-accent"
            />
          </div>

          <label className="w-full sm:w-auto px-4 py-2 bg-editorial-accent hover:bg-editorial-accent/90 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors">
            <Upload size={14} />
            <span>Upload Image</span>
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        {/* Gallery Grid */}
        <div className="p-5 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="border border-dashed border-editorial-border rounded-lg p-12 text-center bg-white/40">
              <ImageIcon size={32} className="mx-auto text-editorial-muted/40 mb-2" />
              <h3 className="font-serif italic font-bold text-sm text-editorial-text">No images in library yet</h3>
              <p className="text-xs text-editorial-muted mt-1 max-w-sm mx-auto">
                Upload book illustrations, maps, scientific diagrams, and author portraits.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map(asset => (
                <div
                  key={asset.id}
                  className="bg-white border border-editorial-border rounded-lg overflow-hidden flex flex-col justify-between group hover:border-editorial-accent transition-all shadow-xs"
                >
                  <div className="aspect-square bg-editorial-sidebar/40 relative overflow-hidden flex items-center justify-center">
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                    {onSelectImage && (
                      <button
                        onClick={() => {
                          onSelectImage(asset.url);
                          onClose();
                        }}
                        className="absolute inset-0 bg-black/50 text-white font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        Insert Image
                      </button>
                    )}
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="text-xs font-bold text-editorial-text truncate" title={asset.name}>
                      {asset.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted">
                      <span>{(asset.size / 1024).toFixed(1)} KB</span>
                      <span>{asset.dateAdded ? new Date(asset.dateAdded).toLocaleDateString() : 'Active'}</span>
                    </div>

                    <div className="pt-2 border-t border-editorial-divider flex items-center justify-between">
                      <button
                        onClick={() => copyUrl(asset)}
                        className="text-[10px] font-bold text-editorial-accent hover:underline flex items-center gap-1"
                      >
                        {copiedId === asset.id ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                        <span>{copiedId === asset.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="text-editorial-muted hover:text-red-600 p-1 transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-editorial-divider bg-editorial-sidebar/30 flex items-center justify-between text-xs text-editorial-muted">
          <span>{assets.length} total media assets</span>
          <button onClick={onClose} className="font-bold uppercase tracking-wider text-editorial-text hover:underline">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
