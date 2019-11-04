FROM node:12

WORKDIR /usr/src/workout

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
