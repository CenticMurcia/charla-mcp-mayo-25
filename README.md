<p align="center">
  <img src="sauron.png" alt="Sauron - Un protocolo para gobernarlos a todos">
</p>

# MCP: Un protocolo para gobernarlos a todos

Este repositorio contiene material de apoyo para la charla "MCP: Un protocolo para gobernarlos a todos" presentada en mayo de 2025. El Model Context Protocol (MCP) es una especificación abierta que define cómo las aplicaciones pueden interactuar con modelos de lenguaje de manera estandarizada.

## Contenido del Repositorio

- **Material de la Presentación**

  - `MCP_ Un protocolo para gobernarlos a todos.pptx` - Presentación en formato PowerPoint
  - `MCP_ Un protocolo para gobernarlos a todos.pdf` - Presentación en formato PDF
  - `sauron.png` - Imagen utilizada en la presentación

- **Documentación MCP**

  - `mcp_manifest_documentation.md.docx` - Documentación del manifiesto MCP
  - `mcp_manifest_example.json` - Ejemplo de archivo de manifiesto MCP

- **Ejemplos de Implementación**
  - `typescript-mcp-sample/` - Implementación de ejemplo en TypeScript
  - `rust-mcp-sample/` - Implementación de ejemplo en Rust

## Ejemplos de Código

### Ejemplo en TypeScript

El directorio `typescript-mcp-sample/` contiene una implementación de MCP en TypeScript. Incluye:

- Dockerfile para contenerización
- Configuración para integración con Claude
- Código fuente en TypeScript para la implementación del protocolo

Para ejecutar el ejemplo de TypeScript:

```bash
cd typescript-mcp-sample
npm install
npm start
```

### Ejemplo en Rust

El directorio `rust-mcp-sample/` contiene una implementación de MCP en Rust. Incluye:

- Código fuente en Rust para la implementación del protocolo
- Generador aleatorio como muestra de funcionalidad

Para ejecutar el ejemplo de Rust:

```bash
cd rust-mcp-sample
cargo run
```

## Más Información

El Model Context Protocol (MCP) es una iniciativa para estandarizar la forma en que las aplicaciones se comunican con modelos de lenguaje, permitiendo una mayor interoperabilidad y simplificando la integración de IA en diferentes entornos de desarrollo.
