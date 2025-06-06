import { TelegramAPI } from './api/index.js';
import type { ChatMessages, ChatsMessages } from './types.js';
import { Types } from './types.js';

export function buildGetMessagesAvailables(api: TelegramAPI) {
  return async (): Promise<ChatsMessages> => {
    const updates = await api.getUpdates();

    const InitialChatsMessages: Map<string, ChatMessages> = new Map();

    const chatsMessagesMap = updates.reduce((chatsMessages, update) => {
      // Verificamos si el update tiene un mensaje y un chat
      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id.toString();

        // Solo consideramos updates con texto (mensajes reales)
        if (update.message.text) {
          // Si este chat no está ya en el mapa, lo añadimos
          if (!chatsMessages.has(chatId)) {
            const chatName =
              update.message.chat.username ||
              update.message.chat.first_name ||
              update.message.chat.title ||
              chatId;

            chatsMessages.set(chatId, Types.createChatMessages(chatId, chatName));
          }

          // Añadimos el mensaje al chat correspondiente
          const chatMessages = chatsMessages.get(chatId);
          if (chatMessages) {
            const user = update.message.from;

            const userName = user?.first_name || user?.username || 'Unknown';
            const userId = user?.id.toFixed() ?? '0';

            chatMessages.messages.push(
              Types.createMessage(
                userId,
                userName,
                update.message.text,
                update.message.date.toString()
              )
            );
          }
        }
      }
      return chatsMessages;
    }, InitialChatsMessages);

    const chatsMessages: ChatsMessages = [];

    chatsMessagesMap.forEach((chatMessages, chatId) => {
      chatsMessages.push(chatMessages);
    });

    return chatsMessages;
  };
}

export function buildGetMessagesByChat(api: TelegramAPI) {
  return async (chatId: string): Promise<ChatMessages> => {
    const updates = await api.getUpdates();

    if (updates.length === 0) {
      throw new Error('No messages available');
    }

    const chatMessages = updates.reduce((chatMessages, update) => {
      // Verificamos si el update tiene un mensaje y un chat
      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id.toString();

        // Solo buscamos mensajes del chat específico
        if (chatId !== chatId) {
          return chatMessages; // Si no es el chat que buscamos, continuamos
        }

        // Solo consideramos updates con texto (mensajes reales)
        if (update.message.text) {
          // Si este chat no está ya en el mapa, lo añadimos
          if (!chatMessages) {
            const chatName =
              update.message.chat.username ||
              update.message.chat.first_name ||
              update.message.chat.title ||
              chatId;

            chatMessages = Types.createChatMessages(chatId, chatName);
          }

          // Añadimos el mensaje al chat correspondiente
          if (chatMessages) {
            const user = update.message.from;

            const userName = user?.first_name || user?.username || 'Unknown';
            const userId = user?.id.toFixed() ?? '0';

            chatMessages.messages.push(
              Types.createMessage(
                userId,
                userName,
                update.message.text,
                update.message.date.toString()
              )
            );
          }
        }
      }

      return chatMessages;
    }, undefined as ChatMessages | undefined);

    if (!chatMessages) {
      throw new Error('No messages available');
    }

    return chatMessages;
  };
}
