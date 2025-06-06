import { Constants } from './constants.js';
import { isTelegramUpdatesResponse } from './types.js';

export function buildGetUpdates(apikey: string) {
  return async () => {
    const url = Constants.getUpdatesUrl(apikey);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error getting updates: ${response.statusText}`);
    }

    const body = await response.json();

    // Usar la función de guarda para validar la respuesta
    if (!isTelegramUpdatesResponse(body)) {
      console.error('Invalid response format from Telegram API:', body);
      throw new Error('Invalid response format from Telegram API');
    }

    return body.result;
  };
}
