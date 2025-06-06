import { describe, expect, test } from '@jest/globals';

// Importamos la función de guarda directamente
import { isTelegramUpdatesResponse } from '../src/telegram/api/types';

describe('Telegram Guard Functions', () => {
  // Test para función de guarda
  test('should validate correct Telegram response structure', () => {
    const validResponse = {
      ok: true,
      result: [
        {
          update_id: 739221700,
          message: {
            message_id: 3,
            from: {
              id: 12659805,
              is_bot: false,
              first_name: 'Juanjo',
              username: 'Juanjofp',
              language_code: 'es'
            },
            chat: {
              id: 12659805,
              first_name: 'Juanjo',
              username: 'Juanjofp',
              type: 'private'
            },
            date: 1747648688,
            text: 'Hola bot'
          }
        }
      ]
    };

    expect(isTelegramUpdatesResponse(validResponse)).toBe(true);
  });

  test('should reject invalid Telegram response structure', () => {
    // Sin la propiedad ok
    expect(isTelegramUpdatesResponse({ result: [] })).toBe(false);

    // ok es false
    expect(isTelegramUpdatesResponse({ ok: false, result: [] })).toBe(false);

    // sin la propiedad result
    expect(isTelegramUpdatesResponse({ ok: true })).toBe(false);

    // result no es un array
    expect(isTelegramUpdatesResponse({ ok: true, result: 'not an array' })).toBe(false);

    // update_id no es un número
    expect(
      isTelegramUpdatesResponse({
        ok: true,
        result: [{ update_id: 'not a number' }]
      })
    ).toBe(false);

    // mensaje incompleto (sin message_id)
    expect(
      isTelegramUpdatesResponse({
        ok: true,
        result: [
          {
            update_id: 123,
            message: {
              date: 1234567890,
              chat: { id: 123, type: 'private' }
            }
          }
        ]
      })
    ).toBe(false);
  });
});
