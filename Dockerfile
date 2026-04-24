# Usamos una versión estable de Node
FROM node:20-alpine

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (solo producción para que sea ligero)
RUN npm install --production

# Copiamos el resto del código
COPY . .

# Creamos la carpeta de subidas (por si acaso no existe)
RUN mkdir -p uploads

# Exponemos el puerto que configuraste en tu código
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "index.js"]