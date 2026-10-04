import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useProviderStatus } from '../hooks/useProviderStatus';
import ChatWindow from '../components/chat/ChatWindow';
import MessageInput from '../components/chat/MessageInput';
import ConversationList from '../components/sidebar/ConversationList';
import ProviderStatusBar from '../components/providers/ProviderStatusBar';

export default function ChatPage() {
  const { messages, sendMessage, stopStreaming, retryLastMessage, isStreaming, switchingMessage, conversationId, loadConversation, startNewChat } = useChat();
  const statuses = useProviderStatus();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [preferredProvider, setPreferredProvider] = useState('AUTO');

  const handleSend = (text) => {
    const ok = sendMessage(text, preferredProvider);
    if (ok) setTimeout(() => setRefreshTrigger((n) => n + 1), 1000);
    return ok;
  };

  return (
    // FIX: Added `cursor-default` to the root container
    <div className="flex h-screen overflow-hidden bg-canvas cursor-default">
      <ConversationList activeConversationId={conversationId} onSelect={loadConversation} onNewChat={startNewChat} refreshTrigger={refreshTrigger} />
      
      <main className="flex min-w-0 flex-1 flex-col">
        <ProviderStatusBar statuses={statuses} />
        <ChatWindow 
          messages={messages} 
          switchingMessage={switchingMessage} 
          isStreaming={isStreaming} 
          onSuggest={handleSend} 
          onRetry={retryLastMessage} 
        />
        <MessageInput onSend={handleSend} onStop={stopStreaming} isStreaming={isStreaming} preferredProvider={preferredProvider} onProviderChange={setPreferredProvider} statuses={statuses} />
      </main>
    </div>
  );
}