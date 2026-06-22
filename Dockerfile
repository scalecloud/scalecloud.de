# syntax=docker/dockerfile:1

##
## Build
##
FROM node:24.17.0 AS build

WORKDIR /build

COPY ./ ./

RUN npm install --ignore-scripts && npm run ng build scalecloud

##
## Deploy
##
FROM nginx:latest AS deploy
COPY --from=build /build/dist/scalecloud/browser /usr/share/nginx/html