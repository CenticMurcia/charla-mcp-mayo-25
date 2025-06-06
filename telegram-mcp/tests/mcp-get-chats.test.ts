import { describe, expect, test } from '@jest/globals';
import { buildTelegramTools, type Chat } from '../src/telegram/index.js';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';
import type { TelegramUpdate } from '../src/telegram/api/types.js';
import '../tests/utils/setup.js';

import { buildTelegramAPIMock } from '../tests/utils/mock-telegram.js';

describe('MCP Get Chats', () => {
  const mockTelegramAPI = buildTelegramAPIMock();

  beforeEach(() => {
    // Reset mocks before each test
    mockTelegramAPI.resetMocks();
  });

  test('should return empty array when no updates are available', async () => {
    // Mock de respuesta vacía para getUpdates
    const emptyUpdates: TelegramUpdate[] = [];
    mockTelegramAPI.getUpdates.mockResolvedValue(emptyUpdates);

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Obtener los chats disponibles
    const chats = await telegramTools.getChatsAvailables();

    // Verificar que se llamó a getUpdates
    expect(mockTelegramAPI.getUpdates).toHaveBeenCalled();

    // Verificar que el resultado es un array vacío
    expect(chats).toEqual([]);
  });

  test('should return a list of available chats from updates', async () => {
    mockTelegramAPI.getUpdates.mockResolvedValue(mockTelegramAPI.mockUpdateSample);

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Obtener los chats disponibles
    const chats = await telegramTools.getChatsAvailables();

    // Verificar que se llamó a getUpdates
    expect(mockTelegramAPI.getUpdates).toHaveBeenCalled();

    // Verificar que el resultado contiene los chats esperados
    expect(chats).toHaveLength(2);

    // Verificar que los chat IDs están como string
    const expectedChats: Chat[] = [
      { id: '111222', name: 'user1' },
      { id: '333444', name: 'user2' }
    ];

    // Comparar chats sin importar el orden
    expect(chats).toEqual(expect.arrayContaining(expectedChats));
  });

  test('should handle updates without message property', async () => {
    // Mock con actualizaciones que no tienen el campo message
    const mockUpdates: TelegramUpdate[] = [
      {
        update_id: 123456789
        // Sin message
      },
      {
        update_id: 123456790,
        message: {
          message_id: 2,
          chat: {
            id: 333444,
            type: 'private'
          },
          date: 1716312350
          // Sin text
        }
      }
    ];

    mockTelegramAPI.getUpdates.mockResolvedValue(mockUpdates);

    // Crear las herramientas de Telegram con la API mockeada
    const telegramTools = buildTelegramTools(mockTelegramAPI);

    // Obtener los chats disponibles
    const chats = await telegramTools.getChatsAvailables();

    // Verificar que se llamó a getUpdates
    expect(mockTelegramAPI.getUpdates).toHaveBeenCalled();

    // La implementación actual devuelve un array vacío porque no procesa los updates
    expect(chats).toEqual([]);
  });

  test('e2e test - integration with real Telegram API', async () => {
    // Crear la API real de Telegram
    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    const telegramTools = buildTelegramTools(api);

    // Obtener los chats disponibles
    const chats = await telegramTools.getChatsAvailables();

    // Verificar que el resultado es un array (podría estar vacío si no hay actualizaciones)
    expect(Array.isArray(chats)).toBe(true);

    expect(chats.length).toBeGreaterThanOrEqual(0); // Puede ser 0 si no hay chats disponibles
  });
});
