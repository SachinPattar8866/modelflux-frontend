import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { connectChatSocket, sendChatMessage, disconnectChatSocket } from '../websocket/chatSocket';
import { getConversationMessages } from '../api/chatApi';

export function useChat() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [switchingMessage, setSwitchingMessage] = useState(null);
  const streamingReplyRef = useRef('');

  useEffect(() => {
    if (!token) return;

    connectChatSocket(
      token,
      (chunk) => {
        if (chunk.conversationId && !conversationId) {
          setConversationId(chunk.conversationId);
        }

        if (chunk.switching) {
          setSwitchingMessage(chunk.token);
          streamingReplyRef.current = '';
          setMessages((prev) => prev.filter((m) => !m.isStreamingPlaceholder));
          return;
        }

        if (chunk.done) {
          setIsStreaming(false);
          setSwitchingMessage(null);
          streamingReplyRef.current = '';
          setMessages((prev) =>
            prev.map((m) =>
              m.isStreamingPlaceholder
                ? { ...m, isStreamingPlaceholder: false, providerUsed: chunk.providerUsed }
                : m
            )
          );
          return;
        }

        if (chunk.token) {
          setSwitchingMessage(null);
          streamingReplyRef.current += chunk.token;
          setMessages((prev) => {
            const withoutPlaceholder = prev.filter((m) => !m.isStreamingPlaceholder);
            return [
              ...withoutPlaceholder,
              {
                role: 'ASSISTANT',
                content: streamingReplyRef.current,
                isStreamingPlaceholder: true,
              },
            ];
          });
        }
      },
      () => setIsConnected(true),
      (error) => console.error('WebSocket error:', error)
    );

    return () => disconnectChatSocket();
  }, [token]);

  const sendMessage = useCallback(
    (text, preferredProvider = 'AUTO') => {
      setMessages((prev) => [...prev, { role: 'USER', content: text }]);
      setIsStreaming(true);
      streamingReplyRef.current = '';
      sendChatMessage(conversationId, text, preferredProvider);
    },
    [conversationId]
  );

  const loadConversation = useCallback(async (id) => {
    const history = await getConversationMessages(id);
    setConversationId(id);
    setMessages(
      history.map((m) => ({
        role: m.role,
        content: m.content,
        providerUsed: m.providerUsed,
      }))
    );
  }, []);

  const startNewChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isStreaming,
    isConnected,
    switchingMessage,
    conversationId,
    loadConversation,
    startNewChat,
  };
}