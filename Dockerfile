FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Install TypeScript globally
RUN yarn global add typescript

ARG TOKEN=DEFAULT_WRONG
ENV TOKEN=${TOKEN}

ARG TEBEX_SECRET=DEFAULT_WRONG
ENV TEBEX_SECRET=${TEBEX_SECRET}

COPY . .

RUN yarn build

RUN yarn add nodemon

# Command to run the bot
CMD ["nodemon", "./dist/index.js"]