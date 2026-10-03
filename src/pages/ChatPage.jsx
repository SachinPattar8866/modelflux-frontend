import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/chat/ChatWindow';
import MessageInput from '../components/chat/MessageInput';
import ConversationList from '../components/sidebar/ConversationList';
import ProviderStatusBar from '../components/providers/ProviderStatusBar';
import ProviderSelector from '../components/providers/ProviderSelector';

export default function ChatPage() {
  const { messages, sendMessage, isStreaming, switchingMessage, conversationId, loadConversation, startNewChat } = useChat();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [preferredProvider, setPreferredProvider] = useState('AUTO');


  const handleSend = (text) => {
    sendMessage(text, preferredProvider);
    // Refresh the sidebar shortly after sending, so a brand-new conversation appears in the list
    setTimeout(() => setRefreshTrigger((n) => n + 1), 1000);
  };

  return (
    <div className="flex h-screen">
      <ConversationList
        activeConversationId={conversationId}
        onSelect={loadConversation}
        onNewChat={startNewChat}
        refreshTrigger={refreshTrigger}
      />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <h1 className="text-xl font-bold">ModelFlux</h1>
          <ProviderSelector selected={preferredProvider} onChange={setPreferredProvider} />
        </header>
        <ProviderStatusBar />
        <ChatWindow messages={messages} switchingMessage={switchingMessage} />
        <MessageInput onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  );
}