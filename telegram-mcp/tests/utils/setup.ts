/**
 * Configuración común para todos los tests
 * Este archivo carga las variables de entorno y configura mocks globales
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { beforeAll } from '@jest/globals';

// Encontrar la raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * Configura las variables de entorno para los tests
 * Se puede importar directamente en los archivos de test o usarse en setupFilesAfterEnv
 */
export const setupEnv = () => {
  // Cargar variables de entorno desde .env
  dotenv.config({ path: path.join(rootDir, '.env') });

  // Variables de entorno requeridas para tests
  const requiredTestEnvVars = ['TELEGRAM_API_KEY'];

  // Configurar variables de entorno de prueba si no existen
  requiredTestEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      process.env[varName] = `test_${varName.toLowerCase()}_for_tests`;
    }
  });
};

// Configurar automáticamente el entorno al importar este archivo
setupEnv();

// Exportar variables útiles
export const testUtils = {
  rootDir,
  setupEnv
};
