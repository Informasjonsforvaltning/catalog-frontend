FROM node:18-alpine
WORKDIR /app
COPY yarn.lock dist/apps/data-service-catalog ./
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
RUN corepack enable
RUN yarn set version stable
RUN yarn install
RUN yarn
CMD ["yarn", "next", "start", "-p", "8080"]
