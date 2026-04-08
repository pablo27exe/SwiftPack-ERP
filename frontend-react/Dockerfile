# Usar Node.js versión 18
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Exponer el puerto
EXPOSE 5173

# Ejecutar el servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]