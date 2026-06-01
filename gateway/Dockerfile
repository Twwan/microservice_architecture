FROM nginx:alpine

RUN mkdir -p /etc/nginx/sites-enabled

COPY nginx.conf /etc/nginx/nginx.conf
COPY service-1.nginx /etc/nginx/sites-enabled/service-1
COPY service-2.nginx /etc/nginx/sites-enabled/service-2
