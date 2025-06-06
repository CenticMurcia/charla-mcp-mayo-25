# Telegram MCP - Servidor MCP para Telegram

Este proyecto implementa un servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.ai/) para integrar con Telegram, permitiendo que modelos de lenguaje como Claude puedan interactuar con chats y mensajes de Telegram.

<p align="center">
  <img src="../sauron.png" alt="MCP: Un protocolo para gobernarlos a todos" width="300">
</p>

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión recomendada: 18+)
- [Docker](https://www.docker.com/get-started)
- Un bot de Telegram con su API key (se obtiene a través de [BotFather](https://t.me/botfather))
- Claude Desktop o VS Code con la extensión Claude

## Configuración

### Configuración del Bot de Telegram

1. Crea un bot de Telegram usando [BotFather](https://t.me/botfather)
2. Obtén el token de API del bot
3. Copia el archivo `.env.example` a `.env` e introduce tu token:

```bash
cp .env.example .env
```

4. Edita el archivo `.env` y agrega tu token de Telegram:

```
TELEGRAM_API_KEY=tu_token_aquí
```

### Configuración con Docker

#### Construye la imagen Docker

```bash
docker build -t telegram-mcp -f Dockerfile .
```

#### Ejecuta el servidor MCP

```bash
docker run -i -e TELEGRAM_API_KEY=tu_token_aquí --rm telegram-mcp
```

### Conexión con Claude

#### Opción 1: Claude Desktop

1. Abre Claude Desktop
2. Ve a Configuración > Preferencias
3. En la sección "Developer Settings", selecciona "Enable custom MCP"
4. Configura los siguientes parámetros:
   - **Server URL**: `docker run -i -e TELEGRAM_API_KEY=tu_token_aquí --rm telegram-mcp`
   - **Server Type**: `docker`

#### Opción 2: Extensión de Claude para VS Code

1. Instala la extensión de Claude para VS Code
2. Abre la configuración de la extensión
3. Busca "Claude: MCP Configuration" y edita la configuración
4. Añade la siguiente configuración:

```json
{
  "serverType": "docker",
  "serverUrl": "docker run -i -e TELEGRAM_API_KEY=tu_token_aquí --rm telegram-mcp"
}
```

### Uso con el Inspector MCP

Para verificar que tu servidor MCP funciona correctamente:

```bash
npx @modelcontextprotocol/inspector docker run -i -e TELEGRAM_API_KEY=tu_token_aquí --rm telegram-mcp
```

## Funcionalidades

Este servidor MCP implementa las siguientes capacidades para Telegram:

- Obtener la lista de chats disponibles
- Obtener mensajes de un chat específico
- Enviar mensajes a un chat

## Comandos útiles

- **Ejecutar en desarrollo**: `npm run dev`
- **Monitorear cambios**: `npm run dev:watch`
- **Compilar el proyecto**: `npm run build`
- **Ejecutar pruebas**: `npm run test`
- **Inspeccionar el servidor MCP**: `npm run inspect`

## Estructura del Proyecto

- `src/` - Código fuente
  - `mcp/` - Implementación del protocolo MCP
  - `telegram/` - Cliente y funciones para la API de Telegram
  - `config/` - Configuración del entorno y secretos
- `tests/` - Tests para las funcionalidades MCP y de Telegram

## Licencia

Este proyecto es parte del material de la charla "MCP: Un protocolo para gobernarlos a todos".
