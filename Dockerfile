# syntax=docker/dockerfile:1

##
## Build
##
FROM node:26 AS build

WORKDIR /build

COPY ./ ./

RUN npm install --ignore-scripts && npx ng build scalecloud --configuration production
##
## Deploy
##
FROM nginx:latest AS deploy
COPY --from=build /build/dist/scalecloud/browser /usr/share/nginx/html