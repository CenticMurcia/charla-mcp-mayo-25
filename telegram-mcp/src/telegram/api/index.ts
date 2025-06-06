import { buildGetMe } from './get-me.js';
import { buildGetUpdates } from './get-updates.js';
import { buildSendMessage } from './send-message.js';

/**
 * Starts the Telegram API service
 * @returns A string message indicating the API has started successfully
 */
async function startTelegramAPI(apiKey: string) {
  return {
    getMe: buildGetMe(apiKey),
    getUpdates: buildGetUpdates(apiKey),
    sendMessage: buildSendMessage(apiKey)
  } as const;
}

export const TelegramAPI = {
  startTelegramAPI
} as const;

// Exportamos el tipo como el valor resuelto de la promesa
export type TelegramAPI = Awaited<ReturnType<typeof startTelegramAPI>>;
