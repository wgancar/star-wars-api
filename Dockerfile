FROM node:10-alpine as baseImage
WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock ./
RUN yarn install --production

FROM baseImage
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000
CMD yarn run start
