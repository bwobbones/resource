#!/bin/bash
source .env_aws

# build resource dist
grunt build

# copy the environment vars
cp ~/.env dist/.env

# build the flask container
docker build -t bwobsandbox/resource-app .

# push to dockerhub
docker login --username=$DOCKER_USER --password=$DOCKER_PASS
docker push bwobsandbox/resource-app

# deploy
ecs-deploy -k $AWS_KEY -s $AWS_SECRET -r $AWS_REGION -c resource -n resource -i bwobsandbox/resource-app