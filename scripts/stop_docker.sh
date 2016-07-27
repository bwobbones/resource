#!/bin/bash

# stop the containers
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker images --no-trunc | grep '<none>' | awk '{ print $3 }' | xargs docker rmi