/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Book, 
  Collaborator, 
  CollaboratorRole, 
  ShareSettings,
  BookComment 
} from '../types.ts';
import { 
  X, 
  Copy, 
  Check, 
  Globe, 
  Lock, 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Link2,
  MessageSquare,
  Send,
  CheckCircle2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useNotification } from '../contexts/NotificationContext.tsx';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onUpdateBook: (updated: Book) => void;
  currentUserName?: string;
  currentUserEmail?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  book,
  onUpdateBook,
  currentUserName = 'Author',
  currentUserEmail = ''
}: ShareModalProps) {
  const { notify } = useNotification();
  const [copied, setCopied] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<CollaboratorRole>('editor');
  const [activeTab, setActiveTab] = useState<'access' | 'comments'>('access');
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  const currentGeneralAccess = book.shareSettings?.generalAccess || 'restricted';
  const currentGeneralPermission = book.shareSettings?.permission || 'viewer';
  const collaborators = book.collaborators || [];
  const comments = book.comments || [];

  const shareUrl = `${window.location.origin}/?shareBookId=${book.id}&access=${currentGeneralPermission}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    notify('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddCollaborator = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      notify('Please enter a valid collaborator email address.', 'warning');
      return;
    }

    if (collaborators.some(c => c.email.toLowerCase() === trimmed)) {
      notify('This collaborator has already been added.', 'info');
      return;
    }

    const newCollaborator: Collaborator = {
      email: trimmed,
      role: newRole,
      addedAt: Date.now()
    };

    const updatedCollaborators = [...collaborators, newCollaborator];
    const updatedCollaboratorEmails = updatedCollaborators.map(c => c.email);
    const updatedEditorEmails = updatedCollaborators
      .filter(c => c.role === 'editor')
      .map(c => c.email);

    onUpdateBook({
      ...book,
      collaborators: updatedCollaborators,
      collaboratorEmails: updatedCollaboratorEmails,
      editorEmails: updatedEditorEmails
    });

    setNewEmail('');
    notify(`Invited ${trimmed} as ${newRole}.`, 'success');
  };

  const handleUpdateCollaboratorRole = (email: string, role: CollaboratorRole) => {
    const updatedCollaborators = collaborators.map(c => 
      c.email === email ? { ...c, role } : c
    );
    const updatedEditorEmails = updatedCollaborators
      .filter(c => c.role === 'editor')
      .map(c => c.email);

    onUpdateBook({
      ...book,
      collaborators: updatedCollaborators,
      editorEmails: updatedEditorEmails
    });
  };

  const handleRemoveCollaborator = (email: string) => {
    const updatedCollaborators = collaborators.filter(c => c.email !== email);
    const updatedCollaboratorEmails = updatedCollaborators.map(c => c.email);
    const updatedEditorEmails = updatedCollaborators
      .filter(c => c.role === 'editor')
      .map(c => c.email);

    onUpdateBook({
      ...book,
      collaborators: updatedCollaborators,
      collaboratorEmails: updatedCollaboratorEmails,
      editorEmails: updatedEditorEmails
    });

    notify(`Removed access for ${email}.`, 'info');
  };

  const handleUpdateGeneralAccess = (generalAccess: 'restricted' | 'anyone_with_link') => {
    const updatedSettings: ShareSettings = {
      generalAccess,
      permission: currentGeneralPermission
    };

    onUpdateBook({
      ...book,
      shareSettings: updatedSettings
    });
  };

  const handleUpdateGeneralPermission = (permission: CollaboratorRole) => {
    const updatedSettings: ShareSettings = {
      generalAccess: currentGeneralAccess,
      permission
    };

    onUpdateBook({
      ...book,
      shareSettings: updatedSettings
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: BookComment = {
      id: uuidv4(),
      authorName: currentUserName,
      authorEmail: currentUserEmail,
      text: commentText.trim(),
      createdAt: Date.now(),
      resolved: false
    };

    onUpdateBook({
      ...book,
      comments: [newComment, ...comments]
    });

    setCommentText('');
    notify('Review comment added.', 'success');
  };

  const handleToggleResolveComment = (id: string) => {
    const updated = comments.map(c => 
      c.id === id ? { ...c, resolved: !c.resolved } : c
    );
    onUpdateBook({
      ...book,
      comments: updated
    });
  };

  const handleDeleteComment = (id: string) => {
    const updated = comments.filter(c => c.id !== id);
    onUpdateBook({
      ...book,
      comments: updated
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-editorial-bg border border-editorial-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header (Google Docs Style) */}
        <div className="p-4 sm:p-5 border-b border-editorial-divider flex items-center justify-between bg-editorial-sidebar/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-editorial-accent text-white flex items-center justify-center shadow-xs">
              <Users size={16} />
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-lg text-editorial-text leading-tight truncate max-w-sm sm:max-w-md">
                Share "{book.title}"
              </h3>
              <p className="text-[11px] font-mono text-editorial-muted">
                Google Docs-style Link Sharing & Collaboration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Switcher: Sharing Access vs Collaborative Review Notes */}
        <div className="flex items-center border-b border-editorial-divider bg-white px-5 pt-2 gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('access')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'access'
                ? 'border-editorial-accent text-editorial-accent'
                : 'border-transparent text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <Users size={14} />
            <span>Access & Link Sharing</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-editorial-accent text-editorial-accent'
                : 'border-transparent text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <MessageSquare size={14} />
            <span>Review Comments ({comments.filter(c => !c.resolved).length})</span>
          </button>
        </div>

        {/* Single Scroll Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'access' && (
            <>
              {/* SECTION 1: Add People and Groups */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                  Add People & Collaborators
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Add collaborator email (e.g. editor@press.org)..."
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddCollaborator(); }}
                      className="w-full bg-white border border-editorial-border rounded-lg px-3.5 py-2 text-xs text-editorial-text outline-none focus:border-editorial-accent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as CollaboratorRole)}
                      className="bg-white border border-editorial-border rounded-lg px-3 py-2 text-xs font-medium text-editorial-text outline-none"
                    >
                      <option value="editor">Editor (Can edit)</option>
                      <option value="commenter">Commenter (Can review)</option>
                      <option value="viewer">Viewer (Can read only)</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleAddCollaborator}
                      className="px-4 py-2 bg-editorial-accent text-white hover:bg-editorial-accent/90 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      <UserPlus size={13} />
                      <span>Invite</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: People with Access */}
              <div className="space-y-2.5 pt-2 border-t border-editorial-divider">
                <span className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                  People with access
                </span>

                <div className="space-y-2">
                  {/* Owner Row */}
                  <div className="flex items-center justify-between p-2.5 bg-white border border-editorial-border/80 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-editorial-text text-white font-mono font-bold text-xs flex items-center justify-center">
                        {book.authorName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-editorial-text">
                          {book.authorName || 'Author'} (You)
                        </div>
                        <div className="text-[10px] font-mono text-editorial-muted">
                          Primary Author & Document Owner
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono uppercase bg-editorial-sidebar px-2 py-0.5 rounded font-bold text-editorial-accent">
                      Owner
                    </span>
                  </div>

                  {/* Collaborators List */}
                  {collaborators.map((c) => (
                    <div key={c.email} className="flex items-center justify-between p-2.5 bg-white border border-editorial-border/80 rounded-lg shadow-2xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-editorial-sidebar text-editorial-accent font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {c.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-editorial-text truncate">
                            {c.email}
                          </div>
                          <div className="text-[10px] font-mono text-editorial-muted capitalize">
                            Role: {c.role}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={c.role}
                          onChange={(e) => handleUpdateCollaboratorRole(c.email, e.target.value as CollaboratorRole)}
                          className="bg-editorial-sidebar/40 border border-editorial-border rounded px-2 py-1 text-xs text-editorial-text outline-none"
                        >
                          <option value="editor">Editor</option>
                          <option value="commenter">Commenter</option>
                          <option value="viewer">Viewer</option>
                        </select>

                        <button
                          onClick={() => handleRemoveCollaborator(c.email)}
                          className="p-1 text-editorial-muted hover:text-red-600 transition-colors"
                          title="Remove access"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: General Access (Google Docs Exact Style) */}
              <div className="space-y-3 pt-3 border-t border-editorial-divider">
                <span className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                  General access
                </span>

                <div className="p-3.5 bg-white border border-editorial-border rounded-xl space-y-3 shadow-2xs">
                  <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-editorial-sidebar flex items-center justify-center text-editorial-accent shrink-0">
                        {currentGeneralAccess === 'anyone_with_link' ? (
                          <Globe size={18} className="text-emerald-700" />
                        ) : (
                          <Lock size={18} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <select
                            value={currentGeneralAccess}
                            onChange={(e) => handleUpdateGeneralAccess(e.target.value as any)}
                            className="font-bold text-xs text-editorial-text bg-transparent border-b border-editorial-accent/40 pb-0.5 outline-none cursor-pointer"
                          >
                            <option value="restricted">Restricted</option>
                            <option value="anyone_with_link">Anyone with the link</option>
                          </select>
                        </div>
                        <p className="text-[11px] text-editorial-muted mt-0.5 leading-tight">
                          {currentGeneralAccess === 'anyone_with_link' 
                            ? 'Anyone on the internet with this link can access the manuscript.'
                            : 'Only people with explicit access can open this manuscript.'}
                        </p>
                      </div>
                    </div>

                    {currentGeneralAccess === 'anyone_with_link' && (
                      <select
                        value={currentGeneralPermission}
                        onChange={(e) => handleUpdateGeneralPermission(e.target.value as CollaboratorRole)}
                        className="bg-editorial-sidebar border border-editorial-border rounded px-2.5 py-1 text-xs font-bold text-editorial-text outline-none shrink-0"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="commenter">Commenter</option>
                        <option value="editor">Editor</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                  Add Review Note / Feedback
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    placeholder="Leave collaborative feedback, chapter suggestion, or typo alert..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-white border border-editorial-border rounded-lg p-2.5 text-xs text-editorial-text outline-none resize-none font-serif"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="px-4 bg-editorial-accent text-white hover:bg-editorial-accent/90 disabled:opacity-40 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                  Collaborative Notes ({comments.length})
                </span>

                {comments.length === 0 ? (
                  <div className="text-center p-8 bg-white border border-editorial-border rounded-xl text-xs text-editorial-muted font-serif italic">
                    No collaborative review notes yet. Post a comment above to coordinate revisions with co-authors and editors.
                  </div>
                ) : (
                  comments.map((cm) => (
                    <div 
                      key={cm.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-1.5 ${
                        cm.resolved 
                          ? 'bg-neutral-50/60 border-editorial-divider opacity-60' 
                          : 'bg-white border-editorial-border shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-xs text-editorial-text">
                            {cm.authorName}
                          </span>
                          <span className="text-[10px] font-mono text-editorial-muted">
                            {new Date(cm.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleResolveComment(cm.id)}
                            className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${
                              cm.resolved ? 'text-emerald-700' : 'text-editorial-muted hover:text-emerald-600'
                            }`}
                            title={cm.resolved ? "Re-open comment" : "Mark as resolved"}
                          >
                            <CheckCircle2 size={13} />
                            <span className="text-[10px]">{cm.resolved ? 'Resolved' : 'Resolve'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteComment(cm.id)}
                            className="p-1 text-editorial-muted hover:text-red-500 rounded transition-colors"
                            title="Delete comment"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-editorial-text font-serif leading-relaxed">
                        {cm.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Copy Link & Done */}
        <div className="p-4 sm:p-5 border-t border-editorial-divider flex items-center justify-between bg-editorial-sidebar/30">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2 bg-white hover:bg-neutral-50 text-editorial-text border border-editorial-border rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 size={14} className="text-editorial-accent" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-editorial-accent text-white hover:bg-editorial-accent/90 rounded-lg text-xs font-bold uppercase tracking-widest shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
