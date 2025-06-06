import { describe, expect, test } from '@jest/globals';

import { buildTelegramAPIMock } from './utils/mock-telegram.js';
import { buildTelegramTools } from '../src/telegram/index.js';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';

describe('MCP Get Chats messages', () => {
  const mockTelegramAPI = buildTelegramAPIMock();

  beforeEach(() => {
    // Reset mocks before each test
    mockTelegramAPI.resetMocks();
  });

  test('should return empty array when no messages are available', async () => {
    // Mock de respuesta vacía para getUpdates
    const emptyUpdates = [];
    mockTelegramAPI.getUpdates.mockResolvedValue(emptyUpdates);

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Obtener los mensajes disponibles
    const messages = await telegramTools.getMessagesAvailables();

    // Verificar que se llamó a getUpdates
    expect(mockTelegramAPI.getUpdates).toHaveBeenCalled();

    // Verificar que el resultado es un array vacío
    expect(messages).toEqual([]);
  });

  test('should return a list of available messages from updates', async () => {
    mockTelegramAPI.getUpdates.mockResolvedValue(mockTelegramAPI.mockUpdateSample);

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Obtener los mensajes disponibles
    const messages = await telegramTools.getMessagesAvailables();

    // Verificar que se llamó a getUpdates
    expect(mockTelegramAPI.getUpdates).toHaveBeenCalled();

    // Verificar que el resultado contiene los mensajes esperados
    expect(messages).toHaveLength(2);

    // Verificar que los mensajes tienen la estructura correcta
    const expectedMessages = [
      {
        chat: { id: '111222', name: 'user1' },
        messages: [
          {
            date: '1716312345',
            from: { id: '111222', name: 'Usuario1' },
            message: 'Mensaje del usuario 1'
          },
          {
            date: '1716312355',
            from: { id: '111222', name: 'Usuario1' },
            message: 'Segundo mensaje del usuario 1'
          }
        ]
      },
      {
        chat: { id: '333444', name: 'user2' },
        messages: [
          {
            date: '1716312350',
            from: { id: '333444', name: 'Usuario2' },
            message: 'Mensaje del usuario 2'
          }
        ]
      }
    ];

    // Comparar mensajes sin importar el orden
    expect(messages).toEqual(expect.arrayContaining(expectedMessages));
  });

  test('should handle updates without message property', async () => {
    // Mock con actualizaciones que no tienen el campo message
    const mockUpdates = [
      { update_id: 123456789 }, // Sin message
      {
        update_id: 123456790,
        message: {
          message_id: 2,
          chat: { id: 333444, type: 'private' },
          date: 1716312350 // Sin text
        }
      }
    ];
    mockTelegramAPI.getUpdates.mockResolvedValue(mockUpdates);

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Obtener los mensajes disponibles
    const messages = await telegramTools.getMessagesAvailables();

    // Verificar que se llamó a getUpdates
    expect(mockTelegramAPI.getUpdates).toHaveBeenCalled();

    // Verificar que el resultado es un array vacío
    expect(messages).toEqual([]);
  });

  test('e2e test - integration with real Telegram API', async () => {
    // Crear la API real de Telegram
    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    const telegramTools = buildTelegramTools(api);

    // Obtener los chats disponibles
    const messages = await telegramTools.getMessagesAvailables();

    // Verificar que el resultado es un array (podría estar vacío si no hay actualizaciones)
    expect(Array.isArray(messages)).toBe(true);

    expect(messages.length).toBeGreaterThanOrEqual(0); // Puede ser 0 si no hay chats disponibles
  });

  test('e2e test - integration with real Telegram API filtered by chatId', async () => {
    // Crear la API real de Telegram
    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    const telegramTools = buildTelegramTools(api);

    // Obtener los chats disponibles
    const messages = await telegramTools.getMessagesAvailablesByChat('12659805');
  });
});
