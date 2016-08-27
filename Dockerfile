# start from base
FROM nodesource/node:4.0  
MAINTAINER Greg Lucas-Smith <greg@resourcefulsoftware.com.au>

# copy our application code
ADD . /opt/resource
WORKDIR /opt/resource/dist

# expose port
EXPOSE 9200

ENV NODE_ENV=production

# start app
CMD [ "node", "./app.js" ]