export default function MessageBubble({ message }) {
  const isUser = message.role === 'USER';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-lg px-4 py-2 rounded-lg ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.providerUsed && (
          <span className="text-xs text-gray-500 mt-1 block">🤖 {message.providerUsed}</span>
        )}
      </div>
    </div>
  );
}