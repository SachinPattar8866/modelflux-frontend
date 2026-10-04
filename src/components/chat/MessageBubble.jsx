import { displayName } from '../providers/providerMeta';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ message, showRetry, isLast, onRetry }) {
  const isUser = message.role === 'USER';

  if (isUser) {
    return (
      <div className="flex w-full flex-col gap-1.5 self-end items-end cursor-default">
        {/* Removed cursor-text so pointer stays normal in padding whitespace */}
        <div className="max-w-[75%] rounded-[24px] bg-[#f0f4f9] px-5 py-3.5 text-[15px] leading-relaxed text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] select-text">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-2 py-0.5 text-[11.5px] font-semibold text-muted hover:text-accent transition-colors cursor-pointer select-none"
            title="Regenerate response"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Retry
          </button>
        )}
      </div>
    );
  }

  const isWaitingForFirstToken = message.isStreamingPlaceholder && !message.content && isLast;
  const showBlockCursor = message.isStreamingPlaceholder && isLast;

  return (
    <div className="flex w-full flex-col gap-2 self-start cursor-default">
      {/* Removed cursor-text here as well */}
      <div className="w-full py-2 text-[15px] leading-relaxed text-ink select-text">
        {isWaitingForFirstToken ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="size-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
            <span className="size-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
            <span className="size-2 rounded-full bg-accent animate-bounce" />
          </div>
        ) : (
          <div className="inline">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="mb-4 last:mb-0 inline" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-ink" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-5 text-ink" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-3 mt-4 text-ink" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1 pl-1" {...props} />,
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto mb-4 rounded-xl border border-border">
                    <table className="min-w-full divide-y divide-border text-sm" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => <th className="bg-sidebar-bg px-4 py-3 font-semibold text-left text-ink" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-3 border-t border-border" {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className="bg-sidebar-bg px-1.5 py-0.5 rounded-md text-[13.5px] font-mono text-accent border border-border/50" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl mb-4 overflow-x-auto text-[13px] font-mono shadow-sm">
                      <code {...props}>{children}</code>
                    </div>
                  );
                },
                strong: ({ node, ...props }) => <strong className="font-semibold text-ink" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-border pl-4 italic text-muted mb-4" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>

            {showBlockCursor && (
              <span className="inline-block w-2 h-4 ml-1 bg-accent align-middle animate-pulse" />
            )}
          </div>
        )}
      </div>

      {message.providerUsed && !isWaitingForFirstToken && (
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-muted mt-1 select-none">
          <span className="grid size-3.5 place-items-center rounded bg-accent-wash text-[9px] font-extrabold text-accent">
            {displayName(message.providerUsed)[0]}
          </span>
          {displayName(message.providerUsed)}
        </div>
      )}
    </div>
  );
}