FROM node:slim

WORKDIR /app

# Copiar archivos de configuración del proyecto
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar la aplicación TypeScript
RUN npm run build

# Comando para ejecutar la aplicación en producción por defecto
# En desarrollo, se sobrescribe en docker-compose.yml
CMD ["node", "dist/main.js"]

# docker build -t telegram-centic -f Dockerfile .
# docker run -i -e TELEGRAM_API_KEY=yourtoken --rm telegram-centic
# npx @modelcontextprotocol/inspector docker run -i -e TELEGRAM_API_KEY=yourbottoken --rm telegram-centic