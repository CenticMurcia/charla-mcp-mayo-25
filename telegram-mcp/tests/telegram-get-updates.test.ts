import { describe, expect, test, jest } from '@jest/globals';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';

describe('Telegram GetUpdates API', () => {
  test('should retrieve updates successfully', async () => {
    // Crear un mock de respuesta para getUpdates
    const mockResponse = {
      ok: true,
      result: [
        {
          update_id: 123456789,
          message: {
            message_id: 1,
            from: {
              id: 987654321,
              is_bot: false,
              first_name: 'Test',
              username: 'test_user',
              language_code: 'en'
            },
            chat: {
              id: 987654321,
              first_name: 'Test',
              username: 'test_user',
              type: 'private'
            },
            date: 1716312345,
            text: 'Hello, bot!'
          }
        },
        {
          update_id: 123456790,
          message: {
            message_id: 2,
            from: {
              id: 987654321,
              is_bot: false,
              first_name: 'Test',
              username: 'test_user',
              language_code: 'en'
            },
            chat: {
              id: 987654321,
              first_name: 'Test',
              username: 'test_user',
              type: 'private'
            },
            date: 1716312350,
            text: 'How are you?'
          }
        }
      ]
    };

    // Mock para no hacer llamadas reales a Telegram durante los tests
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)
    );

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Verificar que el objeto API tiene el método getUpdates
    expect(api).toHaveProperty('getUpdates');

    // Llamar a getUpdates
    const updates = await api.getUpdates();

    // Verificar la información recibida de las actualizaciones
    expect(updates).toBeDefined();
    expect(updates).toBeInstanceOf(Array);
    expect(updates.length).toBe(2);

    // Verificar la primera actualización
    expect(updates[0].update_id).toBe(123456789);

    if (!updates[0].message) {
      throw 'Message is undefined';
    }

    expect(updates[0].message.message_id).toBe(1);
    expect(updates[0].message.text).toBe('Hello, bot!');

    if (!updates[0].message.from) {
      throw 'Message.from is undefined';
    }

    expect(updates[0].message.from.username).toBe('test_user');
    expect(updates[0].message.chat.id).toBe(987654321);

    // Verificar la segunda actualización
    expect(updates[1].update_id).toBe(123456790);

    if (!updates[1].message) {
      throw 'Message is undefined';
    }

    expect(updates[1].message.text).toBe('How are you?');

    // Verificar que se llamó a fetch con los parámetros correctos
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toContain('/getUpdates');

    // Limpiar el mock
    fetchSpy.mockRestore();
  });

  test('should handle empty updates', async () => {
    // Crear un mock de respuesta vacía para getUpdates
    const mockResponse = {
      ok: true,
      result: []
    };

    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)
    );

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Llamar a getUpdates
    const updates = await api.getUpdates();

    // Verificar que la respuesta es un array vacío
    expect(updates).toBeDefined();
    expect(updates).toBeInstanceOf(Array);
    expect(updates.length).toBe(0);

    // Limpiar el mock
    fetchSpy.mockRestore();
  });

  test('should handle invalid responses', async () => {
    // Mock con una respuesta inválida
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            ok: false,
            error_code: 401,
            description: 'Unauthorized'
          })
      } as Response)
    );

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Verificar que se lanza un error cuando la respuesta es inválida
    await expect(api.getUpdates()).rejects.toThrow('Invalid response format from Telegram API');

    // Limpiar el mock
    fetchSpy.mockRestore();
  });

  test('should handle API errors', async () => {
    // Mock con un error HTTP
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error'
      } as Response)
    );

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Verificar que se lanza un error cuando la API responde con un error
    await expect(api.getUpdates()).rejects.toThrow('Error getting updates: Internal Server Error');

    // Limpiar el mock
    fetchSpy.mockRestore();
  });

  test('e2e mock test for getUpdates with real-like data structure', async () => {
    // Crear un mock con una estructura similar a la respuesta real
    const mockResponse = {
      ok: true,
      result: [
        {
          update_id: 739221701,
          message: {
            message_id: 4,
            from: {
              id: 12345678,
              is_bot: false,
              first_name: 'John',
              username: 'john_doe',
              language_code: 'en'
            },
            chat: {
              id: 12345678,
              first_name: 'John',
              username: 'john_doe',
              type: 'private'
            },
            date: Math.floor(Date.now() / 1000),
            text: 'Hello bot, how are you?'
          }
        }
      ]
    };

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Obtener las actualizaciones
    const updates = await api.getUpdates();
  });
});
