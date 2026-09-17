FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm && apk add --no-cache openssl libc6-compat

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN cd apps/backend && pnpm prisma generate
RUN pnpm turbo build --filter=@repo/backend

FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm && apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=3000

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/generated ./apps/backend/generated
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts

EXPOSE 3000

CMD ["sh", "-c", "pnpm --filter @repo/backend run prisma:deploy && pnpm --filter @repo/backend run prisma:seed && node apps/backend/dist/main.js"]