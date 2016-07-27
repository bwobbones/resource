# start from base
FROM nodesource/node:4.0  
MAINTAINER Greg Lucas-Smith <greg@resourcefulsoftware.com.au>

# install system-wide deps for python and node
# RUN apt-get -yqq update
# RUN apt-get -yqq install nodejs npm
# RUN ln -s /usr/bin/nodejs /usr/bin/node

# copy our application code
ADD . /opt/resource
WORKDIR /opt/resource/dist

# expose port
EXPOSE 9000

ENV NODE_ENV=production

# start app
CMD [ "node", "./app.js" ]