import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const SUGGESTIONS = [
  'Explain how circuit breakers work',
  'Compare Redis and Postgres for caching',
  'Review my REST API design',
  'Define Docker in two lines',
];

export default function ChatWindow({ messages, switchingMessage, isStreaming, onSuggest, onRetry }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, switchingMessage]);

  return (
    <section className="flex-1 overflow-y-auto py-9">
      <div className="mx-auto flex max-w-[720px] flex-col gap-5 px-6">
        {messages.length === 0 ? (
          <div className="pt-16 select-none">
            <h1 className="text-2xl font-extrabold tracking-tight">What do you want to ask?</h1>
            <p className="mt-1.5 text-[14.5px] text-ink-soft">ModelFlux picks the healthiest provider and falls back if one goes down.</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => onSuggest(s)} className="rounded-xl border border-line bg-white dark:bg-sidebar px-4 py-3 text-left text-[13.5px] font-medium hover:border-accent cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'USER';
            const nextMsg = messages[idx + 1];
            // Show retry button ONLY if this is a user message and the corresponding assistant response was stopped
            const showRetry = isUser && nextMsg && nextMsg.role === 'ASSISTANT' && nextMsg.isStopped;

            return (
              <MessageBubble 
                key={idx} 
                message={msg} 
                isLast={idx === messages.length - 1} 
                showRetry={showRetry} 
                onRetry={onRetry} 
              />
            );
          })
        )}

        {switchingMessage && (
          <div className="flex items-center gap-2 self-start rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 select-none">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            {switchingMessage}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}