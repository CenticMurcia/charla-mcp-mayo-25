use anyhow::Result;
use rmcp::{ServiceExt, transport::stdio};
use tracing_subscriber::{self, EnvFilter};

// Importamos nuestro módulo generador de números aleatorios
mod random_generator;
use random_generator::RandomGenerator;

/// Ejemplo de uso en inspector:
/// npx @modelcontextprotocol/inspector /Users/juanjo/Projects/Centic/Charlas/mcp-mayo-25/rust-mcp-sample/target/release/rust-mcp-sample

#[tokio::main]
async fn main() -> Result<()> {
    // Inicializar el logger para mensajes de depuración
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive(tracing::Level::DEBUG.into()))
        .with_writer(std::io::stderr)
        .with_ansi(false)
        .init();

    // Crear una instancia de nuestro generador de números aleatorios
    let service = RandomGenerator::new().serve(stdio()).await?;

    // Esperar a que el servidor termine
    service.waiting().await?;

    Ok(())
}
