import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-default select-none">
      <div 
        className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-canvas shadow-2xl border border-line flex flex-col md:flex-row h-[480px] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Tabs */}
        <div className="w-[180px] shrink-0 border-r border-line bg-sidebar p-3 flex flex-col gap-1">
          <div className="px-2 pb-3 pt-2 text-[11px] font-bold tracking-wide text-muted uppercase">Settings</div>
          
          <button
            onClick={() => setActiveTab('general')}
            className={`text-left px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
              activeTab === 'general' ? 'bg-canvas shadow-sm border border-line text-ink' : 'text-ink-soft hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            General
          </button>
          
          <button
            onClick={() => setActiveTab('personalization')}
            className={`text-left px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
              activeTab === 'personalization' ? 'bg-canvas shadow-sm border border-line text-ink' : 'text-ink-soft hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Personalization
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`text-left px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
              activeTab === 'data' ? 'bg-canvas shadow-sm border border-line text-ink' : 'text-ink-soft hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Data controls
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col bg-canvas">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">
              {activeTab === 'general' && 'General Settings'}
              {activeTab === 'personalization' && 'Custom Instructions'}
              {activeTab === 'data' && 'Data & Privacy'}
            </h2>
            <button onClick={onClose} className="p-1 text-muted hover:text-ink rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {activeTab === 'general' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">Theme</div>
                  <div className="text-[13px] text-muted">Customize the interface appearance.</div>
                </div>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="border border-line rounded-lg px-3 py-1.5 text-[13px] font-medium bg-canvas text-ink outline-none cursor-pointer"
                >
                  <option value="system">System Default</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
              <div className="mt-auto pt-4">
                <button onClick={logout} className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-lg text-[13.5px] font-semibold transition-colors cursor-pointer">
                  Log out of ModelFlux
                </button>
              </div>
            </div>
          )}

          {activeTab === 'personalization' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[14.5px] font-semibold text-ink">What would you like ModelFlux to know about you?</label>
                <textarea 
                  placeholder="e.g., I'm a software developer working with React and Node.js..."
                  className="w-full border border-line rounded-xl p-3 text-[13px] h-20 outline-none focus:border-accent resize-none bg-sidebar text-ink cursor-text select-text placeholder:text-muted"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14.5px] font-semibold text-ink">How would you like ModelFlux to respond?</label>
                <textarea 
                  placeholder="e.g., Keep answers concise. Always provide code examples."
                  className="w-full border border-line rounded-xl p-3 text-[13px] h-20 outline-none focus:border-accent resize-none bg-sidebar text-ink cursor-text select-text placeholder:text-muted"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button className="bg-accent text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  Save Instructions
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">Export Data</div>
                  <div className="text-[13px] text-muted">Download a copy of your chat history.</div>
                </div>
                <button className="border border-line rounded-lg px-4 py-1.5 text-[13px] font-medium text-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  Export JSON
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <div className="text-[14.5px] font-semibold text-red-600 dark:text-red-400">Clear all chats</div>
                  <div className="text-[13px] text-muted">Permanently delete all conversation history.</div>
                </div>
                <button className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer">
                  Delete All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}