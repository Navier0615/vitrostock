# Usamos Node 20+ para soportar la opción --env-file en el comando start
FROM node:20-alpine

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos todo el código fuente del backend al contenedor
COPY . .

# Exponemos el puerto en el que corre la aplicación Node dentro del contenedor
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "start"]
