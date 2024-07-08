FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

RUN yarn build

COPY ./dist .

RUN yarn add nodemon

# Command to run the bot
CMD ["nodemon", "index.js"]