FROM node:22-alpine
WORKDIR /app
COPY yarn.lock dist/apps/catalog-portal ./
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
RUN corepack enable
RUN yarn set version stable
RUN yarn install
CMD ["yarn", "next", "start", "-p", "8080"]
