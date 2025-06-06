import { TelegramAPI } from './api/index.js';
import type { Chats, Chat, Messages } from './types.js';
import { buildGetChatsAvailables } from './get-chats-availables.js';
import { buildGetMessagesAvailables, buildGetMessagesByChat } from './get-messages-availables.js';
import { buildSendMessageToChat } from './send-message.js';
import { Secrets } from '../config/secrets.js';

function buildTelegramTools(api: TelegramAPI) {
  return {
    getChatsAvailables: buildGetChatsAvailables(api),
    getMessagesAvailables: buildGetMessagesAvailables(api),
    getMessagesAvailablesByChat: buildGetMessagesByChat(api),
    sendMessageToChat: buildSendMessageToChat(api)
  } as const;
}

type TelegramTools = ReturnType<typeof buildTelegramTools>;

async function defaultTelegramTools(): Promise<TelegramTools> {
  const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);
  return buildTelegramTools(api);
}

export type { Chat, Messages, TelegramTools };
export { buildTelegramTools, defaultTelegramTools, TelegramAPI };
