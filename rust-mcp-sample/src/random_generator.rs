use rand::Rng;
use rmcp::{Error as McpError, ServerHandler, model::*, tool};

/// Servidor que proporciona herramientas para generar números aleatorios
#[derive(Debug, Clone, Default)]
pub struct RandomGenerator {}

#[tool(tool_box)]
impl RandomGenerator {
    pub fn new() -> Self {
        Self {}
    }

    /// Genera un número aleatorio entre los límites especificados
    #[tool(
        description = "Genera un número aleatorio entre los límites especificados (por defecto, entre 1 y 10)"
    )]
    pub async fn random_number_one(
        &self,
        #[tool(param)] min: Option<i32>,
        #[tool(param)] max: Option<i32>,
    ) -> Result<CallToolResult, McpError> {
        // Usamos valores por defecto si no se especifican parámetros
        let min_value = min.unwrap_or(1);
        let max_value = max.unwrap_or(10);

        // Validación básica
        if min_value >= max_value {
            return Err(McpError::invalid_params(
                "El valor mínimo debe ser menor que el valor máximo",
                None,
            ));
        }

        // Generamos un número aleatorio
        let mut rng = rand::thread_rng();
        let random_value = rng.gen_range(min_value..=max_value);

        // Creamos el resultado con información de rango utilizado
        let message = if min.is_none() || max.is_none() {
            format!(
                "Número aleatorio generado: {} (usando rango: {} a {})",
                random_value, min_value, max_value
            )
        } else {
            format!("Número aleatorio generado: {}", random_value)
        };

        Ok(CallToolResult::success(vec![Content::text(message)]))
    }
}

#[tool(tool_box)]
impl ServerHandler for RandomGenerator {
    fn get_info(&self) -> ServerInfo {
        ServerInfo {
            protocol_version: ProtocolVersion::V_2024_11_05,
            capabilities: ServerCapabilities::builder().enable_tools().build(),
            server_info: Implementation::from_build_env(),
            instructions: Some(
                "Un servidor que proporciona herramientas para generar números aleatorios".into(),
            ),
        }
    }
}
