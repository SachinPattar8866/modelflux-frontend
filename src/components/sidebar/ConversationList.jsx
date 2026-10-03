import { useEffect, useState } from 'react';
import { listConversations } from '../../api/chatApi';

export default function ConversationList({ activeConversationId, onSelect, onNewChat, refreshTrigger }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    listConversations().then(setConversations).catch(console.error);
  }, [refreshTrigger]);

  return (
    <div className="w-64 bg-gray-50 border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-4 py-3 border-b hover:bg-gray-100 truncate ${
              activeConversationId === conv.id ? 'bg-gray-200' : ''
            }`}
          >
            {conv.title}
          </button>
        ))}
      </div>
    </div>
  );
}