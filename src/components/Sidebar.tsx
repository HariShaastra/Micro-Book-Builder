/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  LayoutTemplate, 
  FolderKanban, 
  FileEdit, 
  CheckCircle2, 
  Archive, 
  Image, 
  Quote, 
  Settings, 
  Sun, 
  Moon, 
  X, 
  LogOut, 
  LogIn, 
  Cloud, 
  RefreshCw,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import Logo from './Logo.tsx';
import { User, auth, signInWithPopup, googleProvider, signOut } from '../lib/firebase.ts';
import { cn } from '../lib/utils.ts';

export type NavTab = 
  | 'home'
  | 'my-books'
  | 'templates'
  | 'projects'
  | 'drafts'
  | 'published'
  | 'archived'
  | 'media'
  | 'references'
  | 'guide'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewBook: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentUser: User | null;
  cloudSyncState: 'synced' | 'syncing' | 'offline' | 'saved_locally' | 'error';
  bookCounts: {
    total: number;
    drafts: number;
    published: number;
    archived: number;
  };
  onBack?: () => void;
  canGoBack?: boolean;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  onNewBook,
  isOpenMobile,
  onCloseMobile,
  theme,
  onToggleTheme,
  currentUser,
  cloudSyncState,
  bookCounts,
  onBack,
  canGoBack = false
}: SidebarProps) {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'my-books', label: 'My Books', icon: BookOpen, badge: bookCounts.total },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'drafts', label: 'Drafts', icon: FileEdit, badge: bookCounts.drafts },
    { id: 'published', label: 'Published / Exported', icon: CheckCircle2, badge: bookCounts.published },
    { id: 'archived', label: 'Archived', icon: Archive, badge: bookCounts.archived },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'references', label: 'References', icon: Quote },
    { id: 'guide', label: 'User Handbook', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.warn('Auth notice:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout notice:', e);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-editorial-sidebar border-r border-editorial-border select-none">
      {/* Top Header & Branding */}
      <div className="p-4 lg:p-5 border-b border-editorial-divider flex items-center justify-between">
        <Logo compact={true} />
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-editorial-muted hover:text-editorial-text rounded-md"
          title="Close Navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Prominent Back Button (if not on Home screen or navigation history exists) */}
      {(currentTab !== 'home' || canGoBack) && (
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              if (onBack) onBack();
              else onSelectTab('home');
              onCloseMobile();
            }}
            className="w-full bg-white/80 hover:bg-white text-editorial-text border border-editorial-border hover:border-editorial-accent py-2 px-3 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
            title="Go to previous screen"
          >
            <ArrowLeft size={15} className="text-editorial-accent" />
            <span>&larr; Back to Previous</span>
          </button>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="p-3 lg:p-4">
        <button
          onClick={() => {
            onNewBook();
            onCloseMobile();
          }}
          className="w-full bg-editorial-accent text-white hover:bg-editorial-accent/90 py-3 px-4 rounded-md font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>New Book</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group text-left cursor-pointer",
                isActive 
                  ? "bg-white text-editorial-text shadow-xs font-semibold border-l-[3px] border-editorial-accent" 
                  : "text-editorial-muted hover:bg-white/50 hover:text-editorial-text"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={cn("transition-colors", isActive ? "text-editorial-accent" : "group-hover:text-editorial-text")} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded-full",
                  isActive ? "bg-editorial-sidebar text-editorial-text font-bold" : "bg-editorial-border/40 text-editorial-muted"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile & Utilities */}
      <div className="p-3 border-t border-editorial-divider space-y-2 bg-white/20">
        {/* Light / Dark Mode Toggle */}
        <div className="flex items-center justify-between px-3 py-1.5 text-xs text-editorial-muted">
          <span className="text-[11px] font-medium">Appearance</span>
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 p-1 px-2.5 rounded-full border border-editorial-border hover:border-editorial-text text-editorial-text bg-white/80 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={12} className="text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={12} className="text-indigo-500" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* User Profile / Cloud Status */}
        {currentUser ? (
          <div className="bg-white p-2.5 rounded-md border border-editorial-border flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-7 h-7 rounded-full object-cover shrink-0 border border-editorial-border" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-editorial-text text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="overflow-hidden leading-tight">
                <div className="text-[11px] font-bold text-editorial-text truncate" title={currentUser.displayName || currentUser.email || 'User'}>
                  {currentUser.displayName || currentUser.email}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-700">
                  {cloudSyncState === 'syncing' ? (
                    <>
                      <RefreshCw size={9} className="animate-spin text-amber-600" />
                      <span className="text-amber-600">Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Cloud size={9} />
                      <span>Firestore Sync</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-editorial-muted hover:text-red-500 rounded transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-white hover:bg-neutral-50 border border-editorial-border p-2 rounded-md text-[10px] font-bold uppercase tracking-wider text-editorial-text flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LogIn size={13} className="text-editorial-accent" />
            <span>Sign in with Google</span>
          </button>
        )}

        {/* Shaastra Ecosystem Tagline */}
        <div className="text-center pt-1 text-[9px] font-mono text-editorial-muted tracking-widest uppercase opacity-70">
          Shaastra Digital Studio
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-20">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
