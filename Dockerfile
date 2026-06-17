# Multi-stage build: node:20 → nginx:alpine

# Build
FROM node:20-alpine AS build
WORKDIR /app

# Cache deps
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Build
COPY . .
RUN npm run build -- --configuration production

# Runtime
FROM nginx:1.27-alpine
COPY --from=build /app/dist/frontend-test-corp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]