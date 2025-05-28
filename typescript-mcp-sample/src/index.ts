import * as fs from 'fs';
import * as path from 'path';

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ReadResourceResult } from '@modelcontextprotocol/sdk/types';

const server = new McpServer({
  name: 'CharlaMCP',
  version: '1.0'
});

// Ejemplo de una tool que suma dos numeros

server.tool('add', 'add two number', { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: 'text', text: `${a + b}` }]
}));

// Ejemplo de una tool que devuelve la informacion de un usuario de github

server.tool(
  'github-user',
  'get github user information',
  { username: z.string() },
  async ({ username }) => {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }
    const userData = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(userData, null, 2)
        }
      ]
    };
  }
);

// Ejemplo de una tool que devuelve la informacion del clima de una ciudad

server.tool(
  'weather',
  'get weather information for a city',
  { city: z.string() },
  async ({ city }: { city: string }) => {
    // const apiKey = '5d9718ada59cdbcee6de696261fd0c98';

    // Obtener coordenadas de la ciudad
    const coordsResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );

    if (!coordsResponse.ok) {
      throw new Error(`Error fetching coordinates: ${coordsResponse.statusText}`);
    }

    const coordsData = await coordsResponse.json();

    const { latitude, longitude } = coordsData.results[0];

    // Obtener información del clima
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&current=is_day`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Error fetching weather: ${response.statusText}`);
    }
    const weatherData = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(weatherData, null, 2)
        }
      ]
    };
  }
);

// Ejemplo recurso dinámico

server.resource(
  'greeting',
  new ResourceTemplate('greeting://{name}', { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`
      }
    ]
  })
);

// ~~~~~~ Ejemplo de recurso estático

server.resource('local-txt', 'txt://local/my_txt', resourceCallback);

// ~~~~~~ Ejemplo de PROMPT

server.prompt('resume', {}, () => ({
  messages: [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `haz un resumen de los archivos de tu contexto`
      }
    }
  ]
}));

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);

// Utils

async function resourceCallback(uri: URL) {
  const imagePath = './sauron.jpg';

  try {
    const imageData = await fs.promises.readFile(imagePath);

    const mimeType = 'image/jpg';

    const foo: ReadResourceResult = {
      contents: [
        {
          uri: uri.href,
          text: 'Este es el texto de recurso que usaria el contexto',
          //mimeType: mimeType,
          name: path.basename(imagePath),
          description: 'Una imagen local',
          //blob: imageData
        } as any
      ]
    };

    return foo;
  } catch (error) {
    console.error(`Error al leer el archivo de imagen en ${imagePath}:`, error);

    return { contents: [] };
  }
}

// Ejemplo de una tool que devuelve los repositorios de un usuario de github
server.tool(
  'github-repos',
  'get github user repositories',
  { username: z.string() },
  async ({ username }) => {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) {
      throw new Error(`Error fetching repositories: ${response.statusText}`);
    }
    const reposData = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(reposData, null, 2)
        }
      ]
    };
  }
);

// Ejemplo de una tool que devuelve los issues de un repositorio de github
server.tool(
  'github-issues',
  'get github repository issues',
  { username: z.string(), repo: z.string() },
  async ({ username, repo }) => {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}/issues`);
    if (!response.ok) {
      throw new Error(`Error fetching issues: ${response.statusText}`);
    }
    const issuesData = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(issuesData, null, 2)
        }
      ]
    };
  }
);
