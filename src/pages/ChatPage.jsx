import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/chat/ChatWindow';
import MessageInput from '../components/chat/MessageInput';

export default function ChatPage() {
  const { messages, sendMessage, isStreaming, switchingMessage } = useChat();

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold">ModelFlux</h1>
      </header>
      <ChatWindow messages={messages} switchingMessage={switchingMessage} />
      <MessageInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}