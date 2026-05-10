# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S trustgate && adduser -S trustgate -G trustgate

# Copy only production dependencies + source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create uploads directory
RUN mkdir -p uploads/avatars uploads/assets && \
    chown -R trustgate:trustgate /app

USER trustgate

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
