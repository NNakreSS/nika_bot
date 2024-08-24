FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Install TypeScript globally
RUN yarn global add typescript

COPY . .

RUN yarn build

# Install nodemon globally
RUN yarn global add nodemon

# Command to run the bot
CMD ["yarn" , "start"]