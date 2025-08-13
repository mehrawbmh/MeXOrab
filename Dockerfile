# syntax=docker/dockerfile:1

# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci || npm install

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage (serve static files)
FROM nginx:1.27-alpine

# Replace default config to enable SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
