FROM node:slim

WORKDIR /app

# Copiar archivos de configuración del proyecto
COPY package*.json ./
COPY tsconfig.json ./
COPY sauron.png ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar la aplicación TypeScript
RUN npm run build

# Comando para ejecutar la aplicación en producción por defecto
# En desarrollo, se sobrescribe en docker-compose.yml
CMD ["node", "dist/index.js"]

# docker build -t charlamcp-centic -f Dockerfile .
# docker run -i --rm charlamcp-centic
# npx @modelcontextprotocol/inspector docker run -i --rm charlamcp-centic
