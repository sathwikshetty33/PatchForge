# Dev-oriented image: runs the Vite dev server so edits are picked up when the
# source is bind-mounted by docker compose.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# vite.config.js already pins port 3000 and host: true, which is also the origin
# allowed by the Go server's CORS middleware.
EXPOSE 3000

CMD ["npm", "run", "dev"]
