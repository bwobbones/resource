#!/bin/bash

# build resource dist
grunt build

# copy the environment
cp ~/.env dist/.env

# stop the containers
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# build the flask container
docker build -t bwobsandbox/resource-app .

# create the network
docker network create resource-net 

# start the mongo container
docker run -d --net resource-net -p 27017:27017 --name mongo mongo

# start the flask app container
docker run -d --net resource-net -p 9200:9200 --name resource-app bwobsandbox/resource-app