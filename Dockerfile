FROM node:14-alpine as builder-base

WORKDIR /usr/context

COPY package.json yarn.lock ./
COPY patches/ ./patches/
RUN yarn

FROM builder-base as frontend-builder

COPY tsconfig.json ./
COPY src ./src/
COPY public ./public/
RUN yarn build

FROM builder-base as backend-builder

COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations/ ./prisma/migrations
COPY server ./server/
RUN yarn server:build

FROM node:14-alpine

WORKDIR /usr/app

ARG NODE_ENV="production"
ENV NODE_ENV="production"

COPY package.json yarn.lock ./
COPY patches/ ./patches/
RUN yarn
COPY prisma/schema.prisma  ./prisma/
COPY prisma/migrations/  ./prisma/migrations
RUN yarn prisma generate

COPY --from=backend-builder /usr/context/server-build/ ./
COPY --from=frontend-builder /usr/context/build ./build/

ENV DATABASE_URL="file:///data/database.db"
ENV UPLOAD_DIRECTORY="/data/"

CMD ["yarn", "start:prod"]
