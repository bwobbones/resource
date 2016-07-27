#!/bin/sh

# instantiates an Xvfb session on display port 99
Xvfb :99 -ac &

# environment variable to let firefox know where to run
export DISPLAY=:99

# run tests 
/usr/local/bin/grunt test:chrome

# end Xvfb session
killall Xvfb