/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Book, Project, TEMPLATES, DocumentType } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import Editor from './components/Editor.tsx';
import Sidebar, { NavTab } from './components/Sidebar.tsx';
import NewBookModal from './components/NewBookModal.tsx';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_DEMO_DOCUMENTS, INITIAL_DEMO_PROJECTS } from './lib/demoData.ts';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  saveBookToFirestore, 
  deleteBookFromFirestore, 
  subscribeUserBooks 
} from './lib/firebase.ts';
import { NotificationProvider, useNotification } from './contexts/NotificationContext.tsx';
import { Menu, ArrowLeft, Sun, Moon } from 'lucide-react';
import Logo from './components/Logo.tsx';

const STORAGE_KEY = 'book-builder-shaastra-books-v4';
const PREV_STORAGE_KEY = 'book-builder-shaastra-books';
const THEME_KEY = 'book-builder-shaastra-theme';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_DEMO_PROJECTS);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [tabHistory, setTabHistory] = useState<NavTab[]>(['home']);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'saved_locally' | 'error'>('saved_locally');

  // Modal & Drawer State
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  });

  const unsubscribeFirestoreRef = useRef<(() => void) | null>(null);
  const isSyncingFromFirestoreRef = useRef(false);

  // Synchronize html class with theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigateToTab = (newTab: NavTab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  const handleBack = () => {
    if (tabHistory.length > 1) {
      const updated = [...tabHistory];
      updated.pop(); // remove current active tab
      const previousTab = updated[updated.length - 1];
      setTabHistory(updated);
      setActiveTab(previousTab);
    } else {
      setActiveTab('home');
    }
  };

  // 1. Initial local load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any newly introduced demo blueprints if missing
          const existingIds = new Set(parsed.map((b: Book) => b.id));
          const missingDemos = INITIAL_DEMO_DOCUMENTS.filter(d => !existingIds.has(d.id));
          setBooks([...parsed, ...missingDemos]);
        } else {
          setBooks(INITIAL_DEMO_DOCUMENTS);
        }
      } catch (e) {
        console.error('Failed to parse books from localStorage', e);
        setBooks(INITIAL_DEMO_DOCUMENTS);
      }
    } else {
      // Migrate any non-demo custom user books from older storage key
      const prevSaved = localStorage.getItem(PREV_STORAGE_KEY);
      let userCustomBooks: Book[] = [];
      if (prevSaved) {
        try {
          const prevParsed = JSON.parse(prevSaved);
          if (Array.isArray(prevParsed)) {
            userCustomBooks = prevParsed.filter((b: Book) => !b.id.startsWith('demo-') && !b.id.startsWith('book-'));
          }
        } catch (_) {}
      }
      setBooks([...INITIAL_DEMO_DOCUMENTS, ...userCustomBooks]);
    }
    setIsInitialized(true);
  }, []);

  // 2. Persist to localStorage whenever books change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, isInitialized]);

  // 3. Listen to Firebase Auth state & attach real-time Firestore sync
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (unsubscribeFirestoreRef.current) {
        unsubscribeFirestoreRef.current();
        unsubscribeFirestoreRef.current = null;
      }

      if (user) {
        setCloudSyncStatus('syncing');
        const unsubFirestore = subscribeUserBooks(
          user.uid,
          async (cloudBooks) => {
            isSyncingFromFirestoreRef.current = true;
            if (cloudBooks.length > 0) {
              setBooks(cloudBooks);
              setCloudSyncStatus('synced');
            } else {
              setCloudSyncStatus('syncing');
              try {
                const currentLocalBooks = books.length > 0 ? books : INITIAL_DEMO_DOCUMENTS;
                for (const book of currentLocalBooks) {
                  await saveBookToFirestore({ ...book, userId: user.uid }, user.uid);
                }
                setCloudSyncStatus('synced');
              } catch (err) {
                console.warn('Initial cloud sync notice:', err);
                setCloudSyncStatus('saved_locally');
              }
            }
            setTimeout(() => {
              isSyncingFromFirestoreRef.current = false;
            }, 300);
          },
          (error) => {
            console.warn('Firestore subscription status:', error);
            setCloudSyncStatus('saved_locally');
          }
        );

        unsubscribeFirestoreRef.current = unsubFirestore;
      } else {
        setCloudSyncStatus('offline');
      }
    });

    return () => {
      unsubAuth();
      if (unsubscribeFirestoreRef.current) {
        unsubscribeFirestoreRef.current();
      }
    };
  }, []);

  // Create Book from Template or Scratch
  const handleCreateBookFromTemplate = async (templateId?: string) => {
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    
    const newBook: Book = {
      id: uuidv4(),
      title: template.id === 'scratch' ? 'Untitled Manuscript' : `${template.name} Manuscript`,
      subtitle: '',
      description: template.description || '',
      type: (['book', 'memoir', 'academic', 'article', 'report', 'research', 'essay', 'anthology', 'plan', 'presentation', 'creative', 'professional', 'scientific', 'thesis', 'notes', 'event', 'sop', 'decision', 'case_study', 'whitepaper', 'prd', 'speech', 'newsletter', 'custom', 'novel', 'children', 'textbook', 'workbook', 'guide', 'handbook', 'portfolio', 'biography', 'autobiography', 'poetry', 'journal', 'project'].includes(template.id) ? template.id : 'book') as DocumentType,
      blueprintId: template.id,
      tags: [template.name],
      isFavorite: false,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: currentUser?.uid,
      authorName: currentUser?.displayName || localStorage.getItem('book-builder-shaastra-user-name') || 'Author',
      chapters: template.structure.map((title, index) => ({
        id: uuidv4(),
        title,
        content: `<h2>${title}</h2><p>Begin writing the opening draft...</p>`,
        isBookmarked: false,
        status: 'draft',
        wordCount: 10,
        order: index
      })),
      assets: []
    };

    setBooks(prev => [newBook, ...prev]);
    setActiveBookId(newBook.id);

    if (currentUser) {
      setCloudSyncStatus('syncing');
      try {
        await saveBookToFirestore(newBook, currentUser.uid);
        setCloudSyncStatus('synced');
      } catch (e) {
        console.warn('Cloud save deferred:', e);
        setCloudSyncStatus('saved_locally');
      }
    }
  };

  // Create Book from Wizard
  const handleCreateBookFromWizard = async (newBook: Book) => {
    const withUser: Book = {
      ...newBook,
      userId: currentUser?.uid,
      authorName: currentUser?.displayName || newBook.authorName || 'Author'
    };

    setBooks(prev => [withUser, ...prev]);
    setActiveBookId(withUser.id);

    if (currentUser) {
      setCloudSyncStatus('syncing');
      try {
        await saveBookToFirestore(withUser, currentUser.uid);
        setCloudSyncStatus('synced');
      } catch (e) {
        console.warn('Cloud save deferred:', e);
        setCloudSyncStatus('saved_locally');
      }
    }
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    const withTimestamp: Book = { 
      ...updatedBook, 
      updatedAt: Date.now(),
      userId: currentUser?.uid || updatedBook.userId 
    };

    setBooks(prev => prev.map(b => b.id === withTimestamp.id ? withTimestamp : b));

    if (currentUser) {
      try {
        await saveBookToFirestore(withTimestamp, currentUser.uid);
        setCloudSyncStatus('synced');
      } catch (e) {
        console.warn('Cloud update deferred:', e);
        setCloudSyncStatus('saved_locally');
      }
    }
  };

  const handleDuplicateBook = async (bookToDuplicate: Book) => {
    const duplicate: Book = {
      ...JSON.parse(JSON.stringify(bookToDuplicate)),
      id: uuidv4(),
      title: `${bookToDuplicate.title} (Duplicate)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: currentUser?.uid
    };

    setBooks(prev => [duplicate, ...prev]);

    if (currentUser) {
      try {
        await saveBookToFirestore(duplicate, currentUser.uid);
      } catch (e) {
        console.warn('Cloud duplication error:', e);
      }
    }
  };

  const handleArchiveBook = async (id: string) => {
    const target = books.find(b => b.id === id);
    if (!target) return;

    const updated: Book = { ...target, status: 'archived', updatedAt: Date.now() };
    setBooks(prev => prev.map(b => b.id === id ? updated : b));

    if (currentUser) {
      try {
        await saveBookToFirestore(updated, currentUser.uid);
      } catch (e) {
        console.warn('Cloud archive error:', e);
      }
    }
  };

  const handleRestoreBook = async (id: string) => {
    const target = books.find(b => b.id === id);
    if (!target) return;

    const updated: Book = { ...target, status: 'draft', updatedAt: Date.now() };
    setBooks(prev => prev.map(b => b.id === id ? updated : b));

    if (currentUser) {
      try {
        await saveBookToFirestore(updated, currentUser.uid);
      } catch (e) {
        console.warn('Cloud restore error:', e);
      }
    }
  };

  const handleDeleteBook = async (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    if (activeBookId === id) setActiveBookId(null);

    if (currentUser) {
      try {
        await deleteBookFromFirestore(id);
      } catch (e) {
        console.warn('Cloud deletion error:', e);
      }
    }
  };

  const activeBook = books.find(b => b.id === activeBookId);

  if (!isInitialized) return null;

  const bookCounts = {
    total: books.filter(b => b.status !== 'archived').length,
    drafts: books.filter(b => b.status === 'draft').length,
    published: books.filter(b => b.status === 'published' || b.status === 'exported').length,
    archived: books.filter(b => b.status === 'archived').length
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-editorial-bg text-editorial-text selection:bg-amber-600 selection:text-white dark:selection:bg-amber-500 dark:selection:text-stone-950 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
        {activeBookId && activeBook ? (
          <div className="flex-1 w-full">
            <Editor 
              book={activeBook} 
              onUpdate={handleUpdateBook} 
              onBack={() => setActiveBookId(null)}
              allBooks={books}
              cloudSyncState={cloudSyncStatus}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen">
            {/* Mobile Top Navigation Bar */}
            <div className="lg:hidden h-14 bg-editorial-sidebar border-b border-editorial-border px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-1.5 sm:p-2 text-editorial-text hover:bg-black/5 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
                  title="Open Navigation"
                  aria-label="Open Navigation"
                >
                  <Menu size={20} />
                </button>
                {activeTab !== 'home' && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 bg-white dark:bg-stone-800 text-editorial-text dark:text-stone-100 border border-editorial-border dark:border-stone-700 rounded-md text-xs flex items-center gap-1 font-bold shadow-2xs hover:border-editorial-accent cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span className="hidden xs:inline">Back</span>
                  </button>
                )}
              </div>

              {/* Animated Kinetic Architecture Logo in Mobile Header */}
              <div className="flex items-center justify-center">
                <Logo compact className="scale-90 sm:scale-100 origin-center" />
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Tap Theme Toggle for Mobile & Tablet */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg bg-white dark:bg-stone-800 text-editorial-text dark:text-stone-100 border border-editorial-border dark:border-stone-700 hover:border-editorial-accent transition-colors shadow-2xs cursor-pointer"
                  title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label="Toggle Dark and Light Mode"
                >
                  {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-editorial-text" />}
                </button>

                <button
                  onClick={() => setIsNewBookModalOpen(true)}
                  className="p-1.5 px-2.5 sm:px-3 bg-editorial-accent text-white hover:bg-editorial-accent/90 rounded text-xs uppercase font-bold tracking-wider shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>+ New</span>
                </button>
              </div>
            </div>

            {/* Left Sidebar (Desktop + Mobile Drawer) */}
            <Sidebar
              currentTab={activeTab}
              onSelectTab={navigateToTab}
              onNewBook={() => setIsNewBookModalOpen(true)}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              theme={theme}
              onToggleTheme={toggleTheme}
              currentUser={currentUser}
              cloudSyncState={cloudSyncStatus}
              bookCounts={bookCounts}
              onBack={handleBack}
              canGoBack={tabHistory.length > 1 || activeTab !== 'home'}
            />

            {/* Main Center Dashboard View */}
            <main className="flex-1 overflow-y-auto">
              <Dashboard 
                books={books} 
                projects={projects}
                activeTab={activeTab}
                onSelectTab={navigateToTab}
                onCreateBook={handleCreateBookFromTemplate}
                onOpenNewBookWizard={() => setIsNewBookModalOpen(true)}
                onImportBook={handleCreateBookFromWizard}
                onSelectBook={setActiveBookId}
                onDuplicateBook={handleDuplicateBook}
                onArchiveBook={handleArchiveBook}
                onRestoreBook={handleRestoreBook}
                onDeleteBook={handleDeleteBook}
                onUpdateBook={handleUpdateBook}
                currentUser={currentUser}
                cloudSyncState={cloudSyncStatus}
                theme={theme}
                onToggleTheme={toggleTheme}
                onBack={handleBack}
              />
            </main>
          </div>
        )}

        {/* Global New Book 4-Step Wizard Modal */}
        <NewBookModal
          isOpen={isNewBookModalOpen}
          onClose={() => setIsNewBookModalOpen(false)}
          onCreateBook={handleCreateBookFromWizard}
          defaultAuthor={currentUser?.displayName || localStorage.getItem('book-builder-shaastra-user-name') || 'Author'}
        />
      </div>
    </NotificationProvider>
  );
}
