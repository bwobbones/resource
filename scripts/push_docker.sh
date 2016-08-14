#!/bin/bash

# build resource dist
grunt build

# stop the containers
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# build the flask container
docker build -t bwobsandbox/resource-app .

# push to dockerhub

docker push bwobsandbox/resource-app