ARG NODE_IMAGE_TAG=18.20.5-alpine

ARG NGINX_IMAGE_TAG=stable-alpine3.20

FROM node:${NODE_IMAGE_TAG} AS builder

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --omit=dev

FROM nginx:${NGINX_IMAGE_TAG}

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/dist/ibsys2/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

EXPOSE 443