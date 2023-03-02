FROM node:18-alpine AS builder
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN yarn
RUN npx nx build concept-catalog ${BUILD_FLAG}

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/builder/dist/apps/concept-catalog ./
ENV NODE_ENV=$NODE_ENV
RUN yarn
CMD yarn next start -p 8080
