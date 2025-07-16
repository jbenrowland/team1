# -------- STAGE 1: Builder --------
FROM node:18-slim AS builder

WORKDIR /app

# Copy dependencies and disable postinstall
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy app code
COPY . .

# Build-time environment to bypass DB
ENV NODE_ENV=production
ENV SKIP_STATIC_BUILD=true
ENV BIODROP_MONGO_CONNECTION_STRING="mongodb://localhost:27017/fake"
ENV BIODROP_API_SECRET="changeme"
# Disable Sentry Downloads for CLI
ENV SENTRY_SKIP_DOWNLOAD=true
ENV SENTRY_DSN=""

RUN npm run build

# -------- STAGE 2: Runtime --------
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/node_modules ./node_modules

# Runtime environment (can override via `docker run -e`)
ENV NODE_ENV=production
ENV PORT=3000
ENV BIODROP_MONGO_CONNECTION_STRING="mongodb://localhost:27017/fake"
ENV BIODROP_API_SECRET="changeme"

EXPOSE 3000
CMD ["npx", "next", "start"]
