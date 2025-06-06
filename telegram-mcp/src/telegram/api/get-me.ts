import { Constants } from './constants.js';
import { isTelegramMeResponse } from './types.js';
import type { TelegramUser } from './types.js';

/**
 * Construye una función para obtener información sobre el bot
 * @param apikey API key del bot de Telegram
 * @returns Función que obtiene la información del bot
 */
export function buildGetMe(apikey: string) {
  return async (): Promise<TelegramUser> => {
    const url = Constants.getMeUrl(apikey);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error getting bot info: ${response.statusText}`);
    }

    const body = await response.json();

    // Usar la función de guarda para validar la respuesta
    if (!isTelegramMeResponse(body)) {
      console.error('Invalid response format from Telegram API:', body);
      throw new Error('Invalid response format from Telegram API');
    }

    // Devolver el objeto usuario del bot
    return body.result;
  };
}
