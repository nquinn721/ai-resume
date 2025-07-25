# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for both backend and frontend
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force
RUN cd client && npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
WORKDIR /app

# Copy all source files
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules

# Build the React frontend
WORKDIR /app/client
RUN npm run build

# Build the NestJS backend
WORKDIR /app
RUN npm run build:server

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./public
COPY --from=builder /app/resume ./resume
COPY --from=builder /app/projects.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json for metadata
COPY package*.json ./

# Change ownership to nestjs user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/main.js"]
