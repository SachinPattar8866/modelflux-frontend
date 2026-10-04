import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversationMessages } from '../api/chatApi';
import { connectChatSocket, sendChatMessage, stopChatMessage, disconnectChatSocket } from '../websocket/chatSocket';

export function useChat() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [switchingMessage, setSwitchingMessage] = useState(null);
  
  const streamingReplyRef = useRef('');
  const isStreamingRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    connectChatSocket(
      token,
      (chunk) => {
        if (!isStreamingRef.current && !chunk.done && !chunk.switching) {
          return;
        }

        if (chunk.conversationId && !conversationId) {
          setConversationId(chunk.conversationId);
        }

        if (chunk.switching) {
          setSwitchingMessage(chunk.token || 'Switching provider...');
          streamingReplyRef.current = '';
          setMessages((prev) =>
            prev.map((m) =>
              m.isStreamingPlaceholder ? { ...m, content: '', providerUsed: null } : m
            )
          );
          return;
        }

        if (chunk.done) {
          isStreamingRef.current = false;
          setIsStreaming(false);
          setSwitchingMessage(null);
          const finalContent = chunk.content || streamingReplyRef.current;

          setMessages((prev) => {
            const hasPlaceholder = prev.some((m) => m.isStreamingPlaceholder);
            if (hasPlaceholder) {
              return prev.map((m) =>
                m.isStreamingPlaceholder
                  ? {
                      ...m,
                      content: finalContent || m.content,
                      isStreamingPlaceholder: false,
                      isStopped: false,
                      providerUsed: chunk.providerUsed || m.providerUsed,
                    }
                  : m
              );
            }
            if (finalContent) {
              return [
                ...prev,
                { role: 'ASSISTANT', content: finalContent, isStreamingPlaceholder: false, isStopped: false, providerUsed: chunk.providerUsed },
              ];
            }
            return prev;
          });

          streamingReplyRef.current = '';
          return;
        }

        if (chunk.token) {
          setSwitchingMessage(null);
          streamingReplyRef.current += chunk.token;
          const currentText = streamingReplyRef.current;

          setMessages((prev) => {
            const hasPlaceholder = prev.some((m) => m.isStreamingPlaceholder);
            if (hasPlaceholder) {
              return prev.map((m) =>
                m.isStreamingPlaceholder ? { ...m, content: currentText, providerUsed: chunk.providerUsed || m.providerUsed } : m
              );
            }
            return [
              ...prev,
              { role: 'ASSISTANT', content: currentText, isStreamingPlaceholder: true, isStopped: false, providerUsed: chunk.providerUsed },
            ];
          });
        }
      },
      () => setIsConnected(true),
      (error) => console.error('WebSocket error:', error)
    );

    return () => disconnectChatSocket();
  }, [token, conversationId]);

  const sendMessage = useCallback(
    (text, preferredProvider = 'AUTO') => {
      try {
        sendChatMessage(conversationId, text, preferredProvider);
      } catch {
        setMessages((prev) => [...prev, { role: 'ASSISTANT', content: 'Could not reach the server. Reconnecting…' }]);
        return false;
      }
      
      streamingReplyRef.current = '';
      isStreamingRef.current = true;
      setIsStreaming(true);
      setSwitchingMessage(null);
      
      setMessages((prev) => {
        const cleaned = prev.map(m => ({ ...m, isStreamingPlaceholder: false }));
        return [
          ...cleaned, 
          { role: 'USER', content: text }, 
          { role: 'ASSISTANT', content: '', isStreamingPlaceholder: true, isStopped: false }
        ];
      });
      
      return true;
    },
    [conversationId]
  );

  const stopStreaming = useCallback(() => {
    if (conversationId) stopChatMessage(conversationId);
    
    isStreamingRef.current = false;
    setIsStreaming(false);
    setSwitchingMessage(null);
    
    const currentText = streamingReplyRef.current;

    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.isStreamingPlaceholder 
          ? { ...m, isStreamingPlaceholder: false, content: currentText || m.content, isStopped: true } 
          : m
      );

      // Persist stopped state locally for this conversation
      if (conversationId) {
        const assistantMsg = updated.find(m => m.isStopped);
        if (assistantMsg) {
          const stored = JSON.parse(localStorage.getItem(`stopped_${conversationId}`) || '[]');
          stored.push({ content: assistantMsg.content });
          localStorage.setItem(`stopped_${conversationId}`, JSON.stringify(stored));
        }
      }

      return updated;
    });

    streamingReplyRef.current = '';
  }, [conversationId]);

  const retryLastMessage = useCallback(() => {
    if (isStreamingRef.current) return;

    const lastUserIndex = messages.map((m) => m.role).lastIndexOf('USER');
    if (lastUserIndex === -1) return;
    const text = messages[lastUserIndex].content;

    try {
      sendChatMessage(conversationId, text, 'AUTO');
    } catch {
      return;
    }

    streamingReplyRef.current = '';
    isStreamingRef.current = true;
    setIsStreaming(true);
    setSwitchingMessage(null);

    setMessages((prev) => {
      const sliced = prev.slice(0, lastUserIndex + 1);
      const cleaned = sliced.map(m => ({ ...m, isStreamingPlaceholder: false }));
      return [
        ...cleaned,
        { role: 'ASSISTANT', content: '', isStreamingPlaceholder: true, isStopped: false },
      ];
    });
  }, [messages, conversationId]);

  const loadConversation = useCallback(async (id) => {
    const history = await getConversationMessages(id);
    setConversationId(id);

    // Check if any messages for this conversation were manually stopped before refresh
    const storedStopped = JSON.parse(localStorage.getItem(`stopped_${id}`) || '[]');

    setMessages(
      history.map((m) => {
        // Match against locally cached stopped content if server returns full text
        const foundStopped = storedStopped.find(s => m.content.startsWith(s.content) && m.role === 'ASSISTANT');
        return {
          role: m.role,
          content: foundStopped ? foundStopped.content : m.content,
          providerUsed: m.providerUsed,
          isStopped: !!foundStopped,
        };
      })
    );
  }, []);

  const startNewChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    streamingReplyRef.current = '';
    isStreamingRef.current = false;
    setIsStreaming(false);
    setSwitchingMessage(null);
  }, []);

  return { messages, sendMessage, isStreaming, stopStreaming, retryLastMessage, isConnected, switchingMessage, conversationId, loadConversation, startNewChat };
}