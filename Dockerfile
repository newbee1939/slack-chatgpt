FROM node:18.9.0-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# なくてもいいかも
RUN npm install typescript

COPY . ./

RUN npm run build

EXPOSE 8080

# Docker Container の起動時に実行するコマンド
CMD [ "npm", "start" ]