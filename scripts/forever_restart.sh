#!/bin/sh

forever stop app.js
forever start -a -l /var/log/resource/out.log app.js