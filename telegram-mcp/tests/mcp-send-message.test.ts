import { describe, expect, test } from '@jest/globals';

import { buildTelegramTools } from '../src/telegram/index.js';
import type { Chat } from '../src/telegram/types.js';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';

import { buildTelegramAPIMock } from '../tests/utils/mock-telegram.js';

describe('MCP Get Chats', () => {
  const mockTelegramAPI = buildTelegramAPIMock();

  beforeEach(() => {
    // Reset mocks before each test
    mockTelegramAPI.resetMocks();
  });

  test('should send a message to a chat', async () => {
    // Mock de respuesta para sendMessage
    const chatId = 123456789;
    const message = 'Hello, this is a test message!';
    mockTelegramAPI.sendMessage.mockResolvedValue({
      message_id: 1,
      from: {
        id: 987654321,
        is_bot: false,
        first_name: 'Test',
        username: 'test_user',
        language_code: 'en'
      },
      chat: {
        id: chatId,
        first_name: 'Test',
        username: 'test_user',
        type: 'private'
      },
      date: Math.floor(Date.now() / 1000),
      text: message
    });

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Enviar un mensaje al chat
    await telegramTools.sendMessageToChat(chatId.toFixed(), message);

    // Verificar que se llamó a sendMessage con los parámetros correctos
    expect(mockTelegramAPI.sendMessage).toHaveBeenCalledWith(chatId.toFixed(), message);
  });
});
