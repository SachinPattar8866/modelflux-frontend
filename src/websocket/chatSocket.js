import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connectChatSocket(token, onMessage, onConnect, onError) {
  stompClient = new Client({
    brokerURL: import.meta.env.VITE_WS_URL,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      stompClient.subscribe('/user/queue/chat', (message) => {
        const chunk = JSON.parse(message.body);
        onMessage(chunk);
      });
      if (onConnect) onConnect();
    },
    onStompError: (frame) => {
      if (onError) onError(frame.body);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function sendChatMessage(conversationId, message, preferredProvider) {
  if (!stompClient || !stompClient.connected) {
    throw new Error('WebSocket not connected');
  }
  stompClient.publish({
    destination: '/app/chat',
    body: JSON.stringify({ conversationId, message, preferredProvider }),
  });
}

export function disconnectChatSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}