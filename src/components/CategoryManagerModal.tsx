/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Folder, 
  FolderOpen, 
  Edit2, 
  Trash2, 
  Plus, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Tag,
  Palette
} from 'lucide-react';
import { DocumentCategory, DocumentSubCategory } from '../types.ts';
import { cn } from '../lib/utils.ts';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: DocumentCategory[];
  onSaveCategories: (categories: DocumentCategory[]) => void;
}

const CATEGORY_COLORS = [
  '#C05800', // Amber Accent
  '#2563EB', // Blue
  '#059669', // Emerald
  '#7C3AED', // Violet
  '#DB2777', // Pink
  '#D97706', // Gold
  '#475569', // Slate
];

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onSaveCategories
}: CategoryManagerModalProps) {
  const [localCategories, setLocalCategories] = useState<DocumentCategory[]>(categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(categories[0]?.id || null);

  // Editing Category state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // New Subcategory state per category
  const [newSubcategoryName, setNewSubcategoryName] = useState<{ [catId: string]: string }>({});

  // Editing Subcategory state
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');

  if (!isOpen) return null;

  // Add Category
  const handleAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: DocumentCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: newCategoryName.trim(),
      color: selectedColor,
      subCategories: []
    };

    const updated = [...localCategories, newCat];
    setLocalCategories(updated);
    onSaveCategories(updated);
    setNewCategoryName('');
    setExpandedCategoryId(newCat.id);
  };

  // Delete Category
  const handleDeleteCategory = (catId: string) => {
    if (window.confirm('Are you sure you want to delete this category and all its subcategories?')) {
      const updated = localCategories.filter(c => c.id !== catId);
      setLocalCategories(updated);
      onSaveCategories(updated);
      if (expandedCategoryId === catId) {
        setExpandedCategoryId(updated[0]?.id || null);
      }
    }
  };

  // Start Rename Category
  const handleStartRenameCategory = (cat: DocumentCategory) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  };

  // Save Rename Category
  const handleSaveRenameCategory = (catId: string) => {
    if (!editingCategoryName.trim()) return;
    const updated = localCategories.map(c => {
      if (c.id === catId) {
        return { ...c, name: editingCategoryName.trim() };
      }
      return c;
    });
    setLocalCategories(updated);
    onSaveCategories(updated);
    setEditingCategoryId(null);
  };

  // Add Subcategory
  const handleAddSubcategory = (catId: string) => {
    const subName = newSubcategoryName[catId]?.trim();
    if (!subName) return;

    const newSub: DocumentSubCategory = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: subName,
    };

    const updated = localCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subCategories: [...c.subCategories, newSub]
        };
      }
      return c;
    });

    setLocalCategories(updated);
    onSaveCategories(updated);
    setNewSubcategoryName({ ...newSubcategoryName, [catId]: '' });
  };

  // Delete Subcategory
  const handleDeleteSubcategory = (catId: string, subId: string) => {
    const updated = localCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subCategories: c.subCategories.filter(s => s.id !== subId)
        };
      }
      return c;
    });
    setLocalCategories(updated);
    onSaveCategories(updated);
  };

  // Save Rename Subcategory
  const handleSaveRenameSubcategory = (catId: string, subId: string) => {
    if (!editingSubcategoryName.trim()) return;
    const updated = localCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subCategories: c.subCategories.map(s => {
            if (s.id === subId) {
              return { ...s, name: editingSubcategoryName.trim() };
            }
            return s;
          })
        };
      }
      return c;
    });
    setLocalCategories(updated);
    onSaveCategories(updated);
    setEditingSubcategoryId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-editorial-bg dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-editorial-border dark:border-stone-800 flex items-center justify-between bg-editorial-sidebar dark:bg-stone-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-editorial-accent/10 dark:bg-amber-950/40 text-editorial-accent dark:text-amber-400 flex items-center justify-center shrink-0">
              <FolderOpen size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-editorial-text dark:text-stone-100">
                Manage Document Categories & Folders
              </h3>
              <p className="text-xs text-editorial-muted dark:text-stone-400 font-sans">
                Create, rename, and organize folders and subfolders for quick document retrieval
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-editorial-muted dark:text-stone-400 hover:text-editorial-text dark:hover:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Create New Category Form */}
          <form onSubmit={handleAddCategory} className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-stone-800/70 border border-editorial-border dark:border-stone-700 space-y-3 shadow-2xs">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-editorial-text dark:text-stone-200 block">
              Create New Category Folder
            </span>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. Research Papers, Historical Fiction, Lecture Series..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-stone-900 border border-editorial-border dark:border-stone-700 rounded-lg text-xs text-editorial-text dark:text-stone-100 placeholder:text-editorial-muted/60 dark:placeholder:text-stone-500 focus:outline-none focus:border-editorial-accent"
                />
              </div>

              {/* Color Selector */}
              <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-neutral-50 dark:bg-stone-900 border border-editorial-border dark:border-stone-700 rounded-lg">
                <Palette size={13} className="text-editorial-muted dark:text-stone-400 mr-1" />
                {CATEGORY_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "w-4 h-4 rounded-full transition-transform cursor-pointer",
                      selectedColor === c ? "scale-125 ring-2 ring-white dark:ring-stone-900 shadow-sm" : "opacity-80 hover:opacity-100"
                    )}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={!newCategoryName.trim()}
                className="px-4 py-2 bg-editorial-accent hover:bg-editorial-accent/90 disabled:opacity-40 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-editorial-muted dark:text-stone-400 font-mono">
              <span>EXISTING FOLDERS & SUB-FOLDERS ({localCategories.length})</span>
              <span>Click folder to expand subcategories</span>
            </div>

            {localCategories.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-editorial-border dark:border-stone-700 rounded-xl text-editorial-muted dark:text-stone-400 text-xs">
                No categories created yet. Add your first category above!
              </div>
            ) : (
              localCategories.map((category) => {
                const isExpanded = expandedCategoryId === category.id;
                const isEditing = editingCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="border border-editorial-border dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-800/80 shadow-2xs"
                  >
                    {/* Category Header Row */}
                    <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 bg-editorial-sidebar/30 dark:bg-stone-800/50">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                          className="p-1 rounded text-editorial-muted dark:text-stone-400 hover:text-editorial-text dark:hover:text-stone-100 cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" 
                          style={{ backgroundColor: category.color || '#C05800' }} 
                        />

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingCategoryName}
                              onChange={(e) => setEditingCategoryName(e.target.value)}
                              autoFocus
                              className="px-2 py-1 bg-white dark:bg-stone-900 border border-editorial-accent rounded text-xs font-semibold text-editorial-text dark:text-stone-100 outline-none flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRenameCategory(category.id)}
                              className="p-1.5 bg-editorial-accent text-white rounded cursor-pointer"
                              title="Save Name"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategoryId(null)}
                              className="p-1.5 text-editorial-muted hover:text-editorial-text cursor-pointer"
                              title="Cancel"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                            onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                          >
                            <span className="font-serif font-bold text-sm text-editorial-text dark:text-stone-100 truncate">
                              {category.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-editorial-sidebar dark:bg-stone-900 text-editorial-muted dark:text-stone-400 border border-editorial-border dark:border-stone-700 shrink-0">
                              {category.subCategories.length} subfolders
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Category Action buttons */}
                      {!isEditing && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartRenameCategory(category)}
                            className="p-1.5 rounded-lg text-editorial-muted dark:text-stone-400 hover:text-editorial-text dark:hover:text-stone-100 hover:bg-white dark:hover:bg-stone-700 transition-colors cursor-pointer"
                            title="Rename Category"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 rounded-lg text-editorial-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subcategories Container */}
                    {isExpanded && (
                      <div className="p-3 sm:p-4 border-t border-editorial-border dark:border-stone-800 bg-neutral-50/50 dark:bg-stone-900/40 space-y-3">
                        {/* Subcategories list */}
                        <div className="space-y-1.5">
                          {category.subCategories.length === 0 ? (
                            <p className="text-xs text-editorial-muted dark:text-stone-400 italic py-1 pl-6">
                              No subcategories yet. Add one below to segment documents inside this folder.
                            </p>
                          ) : (
                            category.subCategories.map((sub) => {
                              const isSubEditing = editingSubcategoryId === sub.id;

                              return (
                                <div
                                  key={sub.id}
                                  className="flex items-center justify-between gap-2 pl-6 pr-2 py-1.5 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition-colors text-xs"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Tag size={12} className="text-editorial-accent dark:text-amber-400 shrink-0" />
                                    {isSubEditing ? (
                                      <div className="flex items-center gap-1.5 flex-1">
                                        <input
                                          type="text"
                                          value={editingSubcategoryName}
                                          onChange={(e) => setEditingSubcategoryName(e.target.value)}
                                          autoFocus
                                          className="px-2 py-0.5 bg-white dark:bg-stone-900 border border-editorial-accent rounded text-xs text-editorial-text dark:text-stone-100 outline-none flex-1"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleSaveRenameSubcategory(category.id, sub.id)}
                                          className="p-1 bg-editorial-accent text-white rounded cursor-pointer"
                                        >
                                          <Check size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingSubcategoryId(null)}
                                          className="p-1 text-editorial-muted hover:text-editorial-text cursor-pointer"
                                        >
                                          <X size={11} />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="font-sans text-editorial-text dark:text-stone-200 truncate">
                                        {sub.name}
                                      </span>
                                    )}
                                  </div>

                                  {!isSubEditing && (
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingSubcategoryId(sub.id);
                                          setEditingSubcategoryName(sub.name);
                                        }}
                                        className="p-1 text-editorial-muted hover:text-editorial-text cursor-pointer"
                                        title="Rename Subcategory"
                                      >
                                        <Edit2 size={11} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                                        className="p-1 text-editorial-muted hover:text-red-500 cursor-pointer"
                                        title="Delete Subcategory"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Add Subcategory input */}
                        <div className="flex items-center gap-2 pl-6 pt-1">
                          <input
                            type="text"
                            placeholder="Add subcategory (e.g. Chapter Drafts, Citations, Volume 1)..."
                            value={newSubcategoryName[category.id] || ''}
                            onChange={(e) => setNewSubcategoryName({
                              ...newSubcategoryName,
                              [category.id]: e.target.value
                            })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubcategory(category.id);
                              }
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 rounded-lg text-xs text-editorial-text dark:text-stone-100 placeholder:text-editorial-muted/50 focus:outline-none focus:border-editorial-accent"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSubcategory(category.id)}
                            disabled={!newSubcategoryName[category.id]?.trim()}
                            className="px-3 py-1.5 bg-editorial-sidebar dark:bg-stone-800 border border-editorial-border dark:border-stone-700 hover:border-editorial-accent text-editorial-text dark:text-stone-200 disabled:opacity-40 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Plus size={12} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-editorial-border dark:border-stone-800 bg-editorial-sidebar dark:bg-stone-900 flex items-center justify-between text-xs text-editorial-muted dark:text-stone-400 shrink-0">
          <span>Changes are autosaved instantly</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-editorial-accent hover:bg-editorial-accent/90 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
