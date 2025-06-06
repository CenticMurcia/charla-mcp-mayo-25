import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import { TelegramAPI } from '../src/telegram/api/index.js';
import { Secrets } from '../src/config/secrets.js';

describe('Telegram API', () => {
  // Test the structure of the TelegramAPI object
  test('should have startTelegramAPI method', () => {
    // Verify the API object structure
    expect(TelegramAPI).toBeDefined();
    expect(typeof TelegramAPI).toBe('object');
    expect(typeof TelegramAPI.startTelegramAPI).toBe('function');
  });
});
