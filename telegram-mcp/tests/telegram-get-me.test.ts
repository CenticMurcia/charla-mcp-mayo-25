import { describe, expect, test, jest } from '@jest/globals';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';

describe('Telegram GetMe API', () => {
  test('should retrieve bot information', async () => {
    // Crear un mock de respuesta para getMe
    const mockResponse = {
      ok: true,
      result: {
        id: 123456789,
        is_bot: true,
        first_name: 'TestBot',
        username: 'test_bot',
        language_code: 'en'
      }
    };

    // Mock para no hacer llamadas reales a Telegram durante los tests
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)
    );

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Verificar que el objeto API tiene el método getMe
    expect(api).toHaveProperty('getMe');

    // Llamar a getMe
    const botInfo = await api.getMe();

    // Verificar la información recibida del bot
    expect(botInfo).toBeDefined();
    expect(botInfo.id).toBe(123456789);
    expect(botInfo.is_bot).toBe(true);
    expect(botInfo.first_name).toBe('TestBot');
    expect(botInfo.username).toBe('test_bot');

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
    await expect(api.getMe()).rejects.toThrow('Invalid response format from Telegram API');

    // Limpiar el mock
    fetchSpy.mockRestore();
  });

  test('e2e test', async () => {
    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);
    const botInfo = await api.getMe();

    expect(botInfo).toBeDefined();
    expect(botInfo.id).toBe(7766400839);
    expect(botInfo.is_bot).toBe(true);
  });
});
