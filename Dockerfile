# =============================================
# Sabor Inteligente MZ - Dockerfile
# Multi-stage build: Frontend build → Backend serve
# =============================================

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend + serve built frontend
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ ./

# Copy built frontend to public directory
COPY --from=frontend-build /app/frontend/dist ./public

# Create directories
RUN mkdir -p uploads logs

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
