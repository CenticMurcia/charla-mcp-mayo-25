import { TelegramAPI } from './api/index.js';
import type { Chats } from './types.js';
import { Types } from './types.js';

export function buildGetChatsAvailables(api: TelegramAPI) {
  return async (): Promise<Chats> => {
    const updates = await api.getUpdates();

    const initialChats: Map<string, string> = new Map();

    const chatsMap = updates.reduce((chats, update) => {
      // Verificamos si el update tiene un mensaje y un chat
      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id.toString();

        // Solo consideramos updates con texto (mensajes reales)
        if (update.message.text) {
          // Usamos el nombre de usuario, el primer nombre o un valor por defecto
          let chatName = 'Unknown';

          if (update.message.chat.username) {
            chatName = update.message.chat.username;
          } else if (update.message.chat.first_name) {
            chatName = update.message.chat.first_name;
          } else if (update.message.chat.title) {
            chatName = update.message.chat.title;
          }

          // Si este chat no está ya en el mapa, lo añadimos
          if (!chats.has(chatId)) {
            chats.set(chatId, chatName);
          }
        }
      }
      return chats;
    }, initialChats);

    const chats: Chats = [];

    chatsMap.forEach((name, id) => {
      chats.push(Types.createChat(id, name));
    });

    return chats;
  };
}
