const TelegramUrl = 'https://api.telegram.org/bot';

const getUpdatesUrl = (token: string) => `${TelegramUrl}${token}/getUpdates`;
const getSendMessageUrl = (token: string) => `${TelegramUrl}${token}/sendMessage`;
const getMeUrl = (token: string) => `${TelegramUrl}${token}/getMe`;

export const Constants = { getUpdatesUrl, getSendMessageUrl, getMeUrl } as const;
