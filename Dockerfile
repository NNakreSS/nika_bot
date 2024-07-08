FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

ARG TOKEN=DEFAULT_WRONG
ENV TOKEN=${TOKEN}

ARG TEBEX_SECRET=DEFAULT_WRONG
ENV TEBEX_SECRET=${TEBEX_SECRET}

RUN yarn build

COPY ./dist .

RUN yarn add nodemon

# Command to run the bot
CMD ["nodemon", "index.js"]