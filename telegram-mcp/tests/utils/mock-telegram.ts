import { jest } from '@jest/globals';
import { TelegramAPI } from '../../src/telegram/api/index.js';
import type {
  TelegramMessage,
  TelegramUpdate,
  TelegramUser
} from '../../src/telegram/api/types.js';

const mockGetUpdates = jest
  .fn<() => Promise<TelegramUpdate[]>>()
  .mockImplementation(async () => []);

const mockSendMessage = jest
  .fn<() => Promise<TelegramMessage>>()
  .mockImplementation(async () => ({} as TelegramMessage));

const mockGetMe = jest
  .fn<() => Promise<TelegramUser>>()
  .mockImplementation(async () => ({} as TelegramUser));

export function buildTelegramAPIMock() {
  const mockTelegramAPI = {
    getUpdates: mockGetUpdates,
    sendMessage: mockSendMessage,
    getMe: mockGetMe
  };

  const mockUpdateSample: TelegramUpdate[] = [
    {
      update_id: 123456789,
      message: {
        message_id: 1,
        from: {
          id: 111222,
          is_bot: false,
          first_name: 'Usuario1',
          username: 'user1',
          language_code: 'es'
        },
        chat: {
          id: 111222,
          first_name: 'Usuario1',
          username: 'user1',
          type: 'private'
        },
        date: 1716312345,
        text: 'Mensaje del usuario 1'
      }
    },
    {
      update_id: 123456790,
      message: {
        message_id: 2,
        from: {
          id: 333444,
          is_bot: false,
          first_name: 'Usuario2',
          username: 'user2',
          language_code: 'en'
        },
        chat: {
          id: 333444,
          first_name: 'Usuario2',
          username: 'user2',
          type: 'private'
        },
        date: 1716312350,
        text: 'Mensaje del usuario 2'
      }
    },
    // Mensaje del mismo usuario 1, debería contarse como un único chat
    {
      update_id: 123456791,
      message: {
        message_id: 3,
        from: {
          id: 111222,
          is_bot: false,
          first_name: 'Usuario1',
          username: 'user1',
          language_code: 'es'
        },
        chat: {
          id: 111222,
          first_name: 'Usuario1',
          username: 'user1',
          type: 'private'
        },
        date: 1716312355,
        text: 'Segundo mensaje del usuario 1'
      }
    }
  ];

  // Reset mocks
  function resetMocks() {
    mockGetUpdates.mockReset();
    mockSendMessage.mockReset();
    mockGetMe.mockReset();

    mockGetUpdates.mockImplementation(async () => [] as TelegramUpdate[]);
    mockSendMessage.mockImplementation(async () => ({} as TelegramMessage));
    mockGetMe.mockImplementation(async () => ({} as TelegramUser));
  }

  // Mock implementations

  return {
    api: mockTelegramAPI as TelegramAPI,

    getUpdates: mockGetUpdates,
    sendMessage: mockSendMessage,
    getMe: mockGetMe,

    resetMocks,

    mockUpdateSample
  };
}
