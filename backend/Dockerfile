FROM node:14-alpine

RUN mkdir -p /blockchain/api && chown -R node:node /blockchain/api

WORKDIR /blockchain/api

ENV PORT=8000

COPY package.json yarn.lock ./

USER node

RUN yarn install

COPY --chown=node:node . .

EXPOSE 8000

CMD ["yarn", "dev"]
