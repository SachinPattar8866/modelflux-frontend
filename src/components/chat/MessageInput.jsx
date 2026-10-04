import { useState, useRef, useEffect } from 'react';
import ProviderSelector from '../providers/ProviderSelector';

export default function MessageInput({ onSend, onStop, isStreaming, preferredProvider, onProviderChange, statuses }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isStreaming) return;
    const ok = onSend(text);
    if (ok) {
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-line bg-canvas p-4 cursor-default select-none">
      <div className="mx-auto max-w-[720px] rounded-2xl border border-line bg-white dark:bg-sidebar p-3.5 shadow-sm flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ModelFlux..."
          rows={1}
          className="w-full resize-none bg-transparent outline-none text-ink text-[14.5px] placeholder:text-muted cursor-text select-text max-h-40 leading-relaxed"
        />
        
        <div className="flex items-center justify-between pt-1 border-t border-line/50">
          <ProviderSelector 
            selected={preferredProvider} 
            onChange={onProviderChange} 
            statuses={statuses} 
          />

          {/* Conditional Button: Shows Stop button during streaming, Send button otherwise */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="grid size-8 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
              title="Stop generating"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!text.trim()}
              className="grid size-8 place-items-center rounded-full bg-accent text-white hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shadow-sm"
              title="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}