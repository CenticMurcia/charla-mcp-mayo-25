// Exportar variables de entorno tipadas
export const Secrets = {
  telegram: process.env['TELEGRAM_API_KEY'] as string
} as const;

export type Secrets = typeof Secrets;
