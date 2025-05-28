# Charla MCP Centic

<div align="center">
  <img src="sauron.png" alt="Sauron" width="300">
</div>

This repository contains a TypeScript implementation of a Model Context Protocol (MCP) server for a demonstration.
It provides several tools and resources accessible through Claude AI and Visual Studio Code.

## Project Structure

- [`src/index.ts`](src/index.ts): Main MCP server implementation with several tools and resources
- Configuration files for Docker, Claude and VS Code integrations
- Static resources (sauron.png) for demonstration

## Building the Docker Image

To build the Docker image for the MCP server:

```sh
docker build -t charlamcp-centic -f Dockerfile .
```

## Running the MCP Server

You can run the MCP server directly:

```sh
# Run from the Docker container
docker run -i --rm charlamcp-centic

# For development, using ts-node
npm run dev

# After building with npm run build
npm start
```

## Testing with MCP Inspector

You can test your MCP server using the MCP Inspector:

```sh
npx @modelcontextprotocol/inspector docker run -i --rm charlamcp-centic
```

or in the project directory:

```sh
npx @modelcontextprotocol/inspector npm run dev
```

## Configuring Claude Desktop

To make your MCP server available in Claude Desktop, create or edit the Claude configuration file:

```json
// File: $HOME/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "charla-mcp-docker": {
      "type": "stdio",
      "command": "docker",
      "args": ["run", "-i", "--rm", "charlamcp-centic"]
    }
  }
}
```

You can also create a project-specific configuration in the `claude` directory:

```json
// File: claude/claude_desktop_config.json
{
  "mcpServers": {
    "charla-mcp-docker": {
      "type": "stdio",
      "command": "docker",
      "args": ["run", "-i", "--rm", "charlamcp-centic"]
    }
  }
}
```

## Configuring Visual Studio Code

To use your MCP server in VS Code, create the following configuration file:

```json
// File: .vscode/mcp.json
{
  "servers": {
    "charla-mcp-docker": {
      "type": "stdio",
      "command": "docker",
      "args": ["run", "-i", "--rm", "charlamcp-centic"]
    }
  }
}
```

## MCP Server Features

This demo includes several example features:

- Tool for adding numbers
- Tool for fetching GitHub user information
- Tool for getting weather information for a city
- Dynamic greeting resource
- Static image resource
- Custom prompt for generating resumes

## Development

To work on this project:

```sh
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build
```
