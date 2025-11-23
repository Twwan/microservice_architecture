FROM node:22-alpine

WORKDIR /./
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
