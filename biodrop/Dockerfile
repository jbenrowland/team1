#Builder Stage
FROM node:18-slim AS builder
 
WORKDIR /app
 
COPY package*.json ./
RUN npm install
 
COPY . .
 
ENV NODE_ENV=production \
    SKIP_MONGO=true \
    BIODROP_MONGO_CONNECTION_STRING="mongodb://fake:27017" \
    BIODROP_API_SECRET="changeme"
 
RUN npm run build
 
# Runtime Stage
FROM node:18-alpine
 
WORKDIR /app
 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/node_modules ./node_modules
 
ENV NODE_ENV=production
ENV PORT=3000
ENV SKIP_MONGO=true
ENV BIODROP_MONGO_CONNECTION_STRING="mongodb://fake:27017"
ENV BIODROP_API_SECRET="changeme"
 
EXPOSE 3000
CMD ["npx", "next", "start"]
