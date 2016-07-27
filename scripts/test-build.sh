#!/bin/bash

BASE_DIR=`dirname $0`

echo "-----------------------"
echo "LOG Running npm install"
echo "-----------------------"
npm install

echo "-----------------------"
echo "LOG Updating bower"
echo "-----------------------"
bower install
bower update

echo "----------------------"
echo "LOG Fixing permissions" 
echo "----------------------"
chmod +x node_modules/karma/bin/karma
chmod +x node_modules/jasmine-node/bin/jasmine-node

echo "-----------------------------"
echo "LOG Starting controller tests"
echo "-----------------------------"
echo node_modules/karma/bin/karma start config/karma-build.conf.js $*
node_modules/karma/bin/karma start config/karma.conf.js $*

echo "----------------------"
echo "LOG Starting api tests"
echo "----------------------"
echo node_modules/jasmine-node/bin/jasmine-node --junitreport --output report/ --forceexit components/*/test/api/*_apispec.js
node_modules/jasmine-node/bin/jasmine-node --junitreport --output report/ --captureExceptions --forceexit components/*/test/api/*_apispec.js

echo "---------------------------"
echo "LOG Starting scenario tests"
echo "---------------------------"
node_modules/karma/bin/karma start config/karma-build-e2e.conf.js
