# ---------- Builder Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Use Chabokan npm mirror
RUN pnpm config set registry https://mirror2.chabokan.net/npm/

# Copy dependency files first (better caching)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the project
COPY . .

# Build NestJS project
RUN pnpm run build


# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Use mirror again
RUN pnpm config set registry https://mirror2.chabokan.net/npm/

# Copy built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# NestJS port
EXPOSE 4000

# Start app
CMD ["node", "dist/src/main.js"]
