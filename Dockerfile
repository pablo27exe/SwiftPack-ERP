FROM node:18-alpine

# Añadir compatibilidad para binarios (necesario para esbuild/vite en alpine)
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]