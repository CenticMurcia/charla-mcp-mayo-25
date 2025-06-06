import type { TelegramTools } from '../telegram/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import zod from 'zod';

export async function buildMCPTools(telegram: TelegramTools) {
  const server = new McpServer({
    name: 'MCPTelegramTools',
    description:
      'Model Context Protocol tools for Telegram. Read messages, send messages, and manage chats.',
    version: '1.0'
  });

  server.tool('getChatsAvailables', 'Get all chats available in Telegram', async () => {
    const chats = await telegram.getChatsAvailables();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(chats, null, 2)
        }
      ]
    };
  });

  server.tool('getMessagesAvailables', 'Get all messages available in Telegram', async () => {
    const messages = await telegram.getMessagesAvailables();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(messages, null, 2)
        }
      ]
    };
  });

  server.tool(
    'getMessagesAvailablesByChat',
    'Get all messages available in a specific chat',
    { chatId: zod.string().describe('The ID of the chat to get messages from') },
    async ({ chatId }) => {
      const messages = await telegram.getMessagesAvailablesByChat(chatId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(messages, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    'sendMessageToChat',
    'Send a message to a specific chat',
    {
      chatId: zod.string().describe('The ID of the chat to send the message to'),
      message: zod.string().describe('The message to send')
    },
    async ({ chatId, message }) => {
      await telegram.sendMessageToChat(chatId, message);

      return {
        content: [
          {
            type: 'text',
            text: `Message sent successfully to chat ${chatId}: ${message}`
          }
        ]
      };
    }
  );

  return server;
}
