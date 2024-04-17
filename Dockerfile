FROM nginx:1.24.0
COPY . /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD curl --fail http://localhost
