import { Constants } from './constants.js';
import { isTelegramSendMessageResponse, type TelegramSendMessageResponse } from './types.js';

export function buildSendMessage(apiKey: string) {
  return async (message: string, chatId: string) => {
    const url = Constants.getSendMessageUrl(apiKey);

    const data = {
      chat_id: chatId,
      text: message
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error sending message: ${response.statusText}`);
    }

    const body = await response.json();

    // Usar la función de guarda para validar la respuesta

    if (!isTelegramSendMessageResponse(body)) {
      console.error('Invalid response format from Telegram API in send message:', body);
      throw new Error('Invalid response format from Telegram API');
    }

    return body.result;
  };
}
