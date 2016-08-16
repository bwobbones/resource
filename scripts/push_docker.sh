#!/bin/bash
source .env

# build resource dist
grunt build

# build the flask container
docker build -t bwobsandbox/resource-app .

# push to dockerhub
docker login --username=$DOCKER_USER --password=$DOCKER_PASS
docker push bwobsandbox/resource-app