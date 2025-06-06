// Alias de tipos para la respuesta de Telegram
type TelegramUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  language_code?: string;
};

type TelegramChat = {
  id: number;
  first_name?: string;
  username?: string;
  title?: string;
  type: string;
};

type TelegramMessage = {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
};

type TelegramMeResponse = {
  ok: boolean;
  result: TelegramUser;
};

type TelegramUpdatesResponse = {
  ok: boolean;
  result: TelegramUpdate[];
};

type TelegramSendMessageResponse = {
  ok: boolean;
  result: TelegramMessage;
};

/**
 * Función de guarda que valida si un valor desconocido es una respuesta válida de Telegram
 * @param value El valor a validar
 * @returns El valor tipado como TelegramResponse si es válido, o null si no lo es
 */
export function isTelegramUpdatesResponse(value: unknown): value is TelegramUpdatesResponse {
  if (!value || typeof value !== 'object') return false;

  // Verificar si tiene la estructura básica esperada
  const response = value as Partial<TelegramUpdatesResponse>;
  if (typeof response.ok !== 'boolean' || !Array.isArray(response.result)) return false;

  // Verificar que ok sea true
  if (!response.ok) return false;

  // Verificar que haya al menos un resultado válido
  if (response.result.length === 0) return true; // No hay actualizaciones es válido

  // Verificar la estructura de cada actualización
  return response.result.every((update) => {
    if (typeof update !== 'object' || update === null) return false;
    if (typeof update.update_id !== 'number') return false;

    // Si tiene un mensaje, verificar su estructura
    if (update.message) {
      const message = update.message;
      if (typeof message !== 'object') return false;
      if (typeof message.message_id !== 'number') return false;
      if (typeof message.date !== 'number') return false;

      // Verificar la estructura del chat
      if (!message.chat || typeof message.chat !== 'object') return false;
      if (typeof message.chat.id !== 'number') return false;
      if (typeof message.chat.type !== 'string') return false;

      // Verificar la estructura del remitente (si existe)
      if (message.from) {
        if (typeof message.from !== 'object') return false;
        if (typeof message.from.id !== 'number') return false;
        if (typeof message.from.is_bot !== 'boolean') return false;
        if (typeof message.from.first_name !== 'string') return false;
      }
    }

    return true;
  });
}

/**
 * Función de guarda que valida si un valor desconocido es una respuesta válida de getMe de Telegram
 * @param value El valor a validar
 * @returns El valor tipado como TelegramMeResponse si es válido, o false si no lo es
 */
export function isTelegramMeResponse(value: unknown): value is TelegramMeResponse {
  if (!value || typeof value !== 'object') return false;

  // Verificar si tiene la estructura básica esperada
  const response = value as Partial<TelegramMeResponse>;
  if (typeof response.ok !== 'boolean' || !response.result) return false;

  // Verificar que ok sea true
  if (!response.ok) return false;

  // Verificar la estructura del usuario
  const user = response.result;
  if (typeof user !== 'object') return false;
  if (typeof user.id !== 'number') return false;
  if (typeof user.is_bot !== 'boolean') return false;
  if (typeof user.first_name !== 'string') return false;

  return true;
}

/**
 * Función de guarda que valida si un valor desconocido es una respuesta válida de getMe de Telegram
 * @param value El valor a validar
 * @returns El valor tipado como TelegramSendMessageResponse si es válido, o false si no lo es
 */

// {"ok":true,"result":[{"update_id":123456789,"message":{"message_id":1,"from":{"id":123456789,"is_bot":true,"first_name":"TestBot","username":"test_bot"},"chat":{"id":987654321,"first_name":"Test","username":"test_user","type":"private"},"date":1716312345,"text":"Test message"}}]}

export function isTelegramSendMessageResponse(
  value: unknown
): value is TelegramSendMessageResponse {
  if (!value || typeof value !== 'object') return false;

  // Verificar si tiene la estructura básica esperada
  const response = value as Partial<TelegramSendMessageResponse>;
  if (typeof response.ok !== 'boolean' || typeof response.result !== 'object') return false;

  // Verificar que ok sea true
  if (!response.ok) return false;

  const result = response.result;

  if (typeof result !== 'object') return false;
  if (typeof result.message_id !== 'number') return false;
  if (typeof result.date !== 'number') return false;

  // Verificar la estructura del chat
  if (!result.chat || typeof result.chat !== 'object') return false;
  if (typeof result.chat.id !== 'number') return false;
  if (typeof result.chat.type !== 'string') return false;

  // Verificar la estructura del remitente (si existe)
  if (result.from) {
    if (typeof result.from !== 'object') return false;
    if (typeof result.from.id !== 'number') return false;
    if (typeof result.from.is_bot !== 'boolean') return false;
    if (typeof result.from.first_name !== 'string') return false;
  }

  return true;
}

// Exportar interfaces para que estén disponibles para otros módulos
export type {
  TelegramUpdatesResponse,
  TelegramMeResponse,
  TelegramSendMessageResponse,
  TelegramUpdate,
  TelegramMessage,
  TelegramChat,
  TelegramUser
};
