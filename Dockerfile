FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:icons
RUN npm run build

FROM node:22-slim AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/server ./server
COPY --from=build /app/public ./public

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data
USER appuser

EXPOSE 3000

CMD ["node", "server/index.js"]
