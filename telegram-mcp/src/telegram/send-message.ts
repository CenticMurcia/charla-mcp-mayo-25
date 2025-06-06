import { Secrets } from '../config/secrets.js';
import type { TelegramAPI } from './api/index.js';

export function buildSendMessageToChat(api: TelegramAPI) {
  return async (chatId: string, message: string): Promise<void> => {
    try {
      await api.sendMessage(message, chatId);
    } catch (error) {
      throw new Error(
        `Failed to send message to chat ${chatId}: ${message} ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
}
