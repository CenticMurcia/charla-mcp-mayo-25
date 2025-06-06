import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Encontrar la raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Cargar variables de entorno desde .env
dotenv.config({ path: path.join(rootDir, '.env') });

// Validar que las variables requeridas estén presentes
const requiredEnvVars = ['TELEGRAM_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(
      ', '
    )}. Please check your .env file.`
  );
}
