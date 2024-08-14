FROM node:18-alpine
WORKDIR /app
COPY yarn.lock dist/apps/catalog-admin ./
ENV NODE_ENV=$NODE_ENV
RUN yarn
CMD ["yarn", "next", "start", "-p", "8080"]
