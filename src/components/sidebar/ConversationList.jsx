import { useEffect, useState, useRef, useCallback } from 'react';
import { listConversations } from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import SettingsModal from './SettingsModal';

export default function ConversationList({ activeConversationId, onSelect, onNewChat, refreshTrigger }) {
  const [conversations, setConversations] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(285);
  const [isResizing, setIsResizing] = useState(false);

  const menuRef = useRef(null);
  const { email, logout } = useAuth();

  useEffect(() => {
    listConversations().then(setConversations).catch(console.error);
  }, [refreshTrigger]);

  // Handle sidebar resizing via mouse drag
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 220 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // Close 3-dot popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isCollapsed) {
    return (
      <aside className="flex h-screen w-[70px] shrink-0 flex-col items-center border-r border-line bg-sidebar py-4 cursor-default select-none transition-all">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-ink cursor-pointer mb-6"
          title="Expand Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button
          type="button"
          onClick={onNewChat}
          className="grid size-[38px] place-items-center rounded-xl border border-line bg-canvas text-ink shadow-sm hover:border-accent cursor-pointer mb-4"
          title="New Chat"
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </aside>
    );
  }

  return (
    <>
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className="relative flex h-screen shrink-0 flex-col border-r border-line bg-sidebar px-3 py-4 cursor-default select-none transition-all"
      >
        {/* Top Header: Logo + Collapse Button */}
        <div className="flex items-center justify-between px-2 pb-5">
          <Logo isCollapsed={isCollapsed} />
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-ink cursor-pointer transition-colors"
            title="Hide Sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="mb-4 mx-1 flex items-center justify-center gap-2 rounded-xl border border-line bg-canvas py-2.5 text-[13.5px] font-semibold hover:border-accent text-ink transition-colors shadow-sm cursor-pointer"
        >
          <span aria-hidden="true">+</span> New chat
        </button>

        <div className="px-3 pb-2 text-[11px] font-bold tracking-wide text-muted uppercase">Recent</div>
        
        {/* Recent Conversations List */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelect(conv.id)}
              className={`shrink-0 truncate rounded-lg px-2.5 py-2.5 text-left text-[13.5px] transition-colors cursor-pointer ${
                activeConversationId === conv.id
                  ? 'bg-canvas shadow-sm border border-line font-semibold text-ink'
                  : 'text-ink-soft hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </nav>

        {/* Bottom Profile Card & 3-Dot Menu */}
        <div className="mt-auto pt-2 px-1 relative" ref={menuRef}>
          <div className="flex w-full items-center gap-3 rounded-xl p-2.5 bg-sidebar transition-colors">
            <div className="grid size-[34px] shrink-0 place-items-center rounded-full bg-gradient-to-tr from-accent to-accent-wash text-[14px] font-bold text-white uppercase shadow-sm">
              {email?.[0] ?? '?'}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[13.5px] font-semibold text-ink">{email?.split('@')[0] || 'User'}</span>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-muted transition-colors cursor-pointer"
              title="Options"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="absolute bottom-[60px] left-2 right-2 rounded-xl bg-canvas border border-line shadow-lg overflow-hidden py-1 z-10">
              <button 
                onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-ink hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Settings
              </button>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Resizer Drag Handle on Right Edge */}
        <div 
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-accent/40 transition-colors"
        />
      </aside>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}