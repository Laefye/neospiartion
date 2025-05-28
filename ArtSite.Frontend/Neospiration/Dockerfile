FROM node:20 AS build
WORKDIR /app
COPY ArtSite.Frontend/package*.json ./
RUN npm install
COPY ArtSite.Frontend/ .
RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]