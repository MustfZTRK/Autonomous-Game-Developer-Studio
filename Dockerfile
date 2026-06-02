# Stage 1: Build the full-stack system assets
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependency catalogs
COPY package*.json tsconfig.json vite.config.ts ./

# Install packages
RUN npm install

# Copy source repository
COPY . .

# Compile frontend static bundles and bundle server.ts for Node execution
RUN npm run build

# Stage 2: Slim execution module
FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# Copy settings catalogs and data schemas
COPY --from=builder /app/config ./config

# Install only production dependencies
RUN npm install --only=production

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
