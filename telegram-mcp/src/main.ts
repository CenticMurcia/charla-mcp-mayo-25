import './config/environment.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Secrets } from './config/secrets.js';
import { buildMCPTools } from './mcp/index.js';
import { buildTelegramTools, TelegramAPI } from './telegram/index.js';

async function main() {
  const api = await TelegramAPI.startTelegramAPI(Secrets.telegram);
  const telegramTools = buildTelegramTools(api);

  const server = await buildMCPTools(telegramTools);

  const transport = new StdioServerTransport();
  server.connect(transport).catch(console.error);
}

main().catch(console.error);
