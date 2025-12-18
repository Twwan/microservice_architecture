FROM node:22-alpine

RUN apk add --no-cache mysql-client

WORKDIR /./
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
