FROM node:18-alpine

WORKDIR /usr/local/app
RUN mkdir -p /usr/local/app

COPY package.json /usr/local/app
COPY . /usr/local/app/

RUN npm i

CMD ["npm", "start"]
EXPOSE 80