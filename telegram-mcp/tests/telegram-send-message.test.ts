import { describe, expect, test, jest } from '@jest/globals';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';

describe('Telegram SendMessage API', () => {
  test('should send a message successfully', async () => {
    // Crear un mock de respuesta para sendMessage

    const mockResponse = {
      ok: true,
      result: {
        message_id: 29,
        from: { id: 7766400839, is_bot: true, first_name: 'Juanjia', username: 'Juanjia_bot' },
        chat: { id: 12659805, first_name: 'Juanjo', username: 'Juanjofp', type: 'private' },
        date: 1748779575,
        text: 'This is another test message'
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

    // Verificar que el objeto API tiene el método sendMessage
    expect(api).toHaveProperty('sendMessage');

    // Llamar a sendMessage
    const result = await api.sendMessage('Test message', '987654321');

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
    expect(result.message_id).toBe(29);

    if (!result.text) {
      throw new Error('Message is undefined');
    }

    expect(result.text).toBe('This is another test message');
    expect(result.chat.id).toBe(12659805);

    // Verificar que se llamó a fetch con los parámetros correctos
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toContain('/sendMessage');
    expect(fetchSpy.mock.calls[0][1]).toHaveProperty('method', 'POST');
    expect(fetchSpy.mock.calls[0][1]).toHaveProperty('headers');
    expect(fetchSpy.mock.calls[0][1]).toHaveProperty('body');

    // Verificar el formato del body
    const bodyMock = fetchSpy.mock.calls[0][1]?.body;

    if (!bodyMock) {
      throw new Error('Body is undefined');
    }

    const bodyContent = JSON.parse(bodyMock.toString());
    expect(bodyContent).toHaveProperty('chat_id', '987654321');
    expect(bodyContent).toHaveProperty('text', 'Test message');

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
            error_code: 400,
            description: 'Bad Request: chat not found'
          })
      } as Response)
    );

    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Verificar que se lanza un error cuando la respuesta es inválida
    await expect(api.sendMessage('Test message', 'invalid_chat_id')).rejects.toThrow(
      'Invalid response format from Telegram API'
    );

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
    await expect(api.sendMessage('Test message', '987654321')).rejects.toThrow(
      'Error sending message: Internal Server Error'
    );

    // Limpiar el mock
    fetchSpy.mockRestore();
  });

  test('e2e mock test for sendMessage', async () => {
    const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);

    // Enviar un mensaje de prueba
    const result = await api.sendMessage('This is another test message', '12659805');

    expect(result).toBeDefined();
  });
});
