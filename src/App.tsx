/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, TEMPLATES } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import Editor from './components/Editor.tsx';
import Mascot from './components/Mascot.tsx';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load books from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('micro-book-builder-books');
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (e) {
        console.error('Failed to parse books from localStorage', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save books to localStorage when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('micro-book-builder-books', JSON.stringify(books));
    }
  }, [books, isInitialized]);

  const createBook = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    
    const newBook: Book = {
      id: uuidv4(),
      title: template.id === 'scratch' ? 'Untitled Book' : `${template.name} Project`,
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      chapters: template.structure.map((title, index) => ({
        id: uuidv4(),
        title,
        content: '',
        isBookmarked: false,
        status: 'draft',
        wordCount: 0,
      })),
    };

    setBooks([newBook, ...books]);
    setActiveBookId(newBook.id);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? { ...updatedBook, updatedAt: Date.now() } : b));
  };

  const deleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      setBooks(prev => prev.filter(b => b.id !== id));
      if (activeBookId === id) setActiveBookId(null);
    }
  };

  const activeBook = books.find(b => b.id === activeBookId);

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text font-sans selection:bg-editorial-text selection:text-white">
      {activeBookId && activeBook ? (
        <Editor 
          book={activeBook} 
          onUpdate={updateBook} 
          onBack={() => setActiveBookId(null)} 
        />
      ) : (
        <Dashboard 
          books={books} 
          onCreateBook={createBook} 
          onSelectBook={setActiveBookId}
          onDeleteBook={deleteBook}
        />
      )}
      <Mascot />
    </div>
  );
}

