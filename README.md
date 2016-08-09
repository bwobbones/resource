# resource
A production ready Human Resourcing and Recruitment application

## Resource set-up instructions: Windows 

### Clone the repo

on the command line: `git clone https://github.com/bwobbones/resource.git`

### Set a SECRET

To actually log in, you'll need to set a SECRET environment variable, something like:

`set SECRET=blahblah`

### Install Mongo

#### Installation

Download the Windows version of MongoDB
https://www.mongodb.org/downloads#production
install into `c:\{Mongodir}`
Add the bin folder (`c:\{Mongodir}\bin`) to path
Create a MongoDB config file, it’s just a text file, for example : `c:\{Mongodir}\mongo.config`

File contents:

```
# store data here
dbpath=c:\{Mongodir}\data
# all output will go here
logpath=c:\{Mongodir}\log\mongo.log
# log read and write operations
diaglog=3
```

#### Mongo as a Windows Service

Run MongoDB server: `mongod.exe --config c:\{Mongodir}\mongo.config`  
 
Add MongoDB as Windows service: `mongod.exe --config c:\{Mongodir}\mongo.config --install`
 
To start MongoDB Service: `net start MongoDB`

To stop MongoDB Service: `net stop MongoDB`

#### Mongo GUI

MongoChef is an awesome front-end interface for your database. 

Install it from here:
http://3t.io/mongochef/

### Dependency Management

#### Node.js

Currently Resource requires Node v4, download from here:

https://nodejs.org/en/download/

`npm install`

#### Bower

We use Bower for front end dependency management (note that this will be removed in favour of npm soon):
    
`npm install -g bower`

`bower install`
    
### Build Management - Grunt

`npm install -g grunt-cli`

### Running Resource

`grunt serve`

### Demo data

Resource creates a database per user so to be able to create demo data a user needs to be registered first

* Run the app with `grunt serve`
* Click on the Register link
* Enter the registration details and click the button

A new database will be created with the name

    resource + the username entered

So for a username `greg` the database created will be `resourcegreg`

Groovy scripts are used to populate database with test/production data.

Groovy needs java, so install latest java SDK from here:
http://java.com/en/

Install groovy from here: 
http://www.groovy-lang.org/download.html and add to path

Update the `./scripts/upload.groovy` file with your new database name and then pre-populate sample user and personnel data from the cloned directory with:

`groovy ./scripts/upload.groovy`

### Testing

Testing is through karma and jasmine:

`grunt test` runs all of the unit and node api tests

`grunt test:chrome` runs all of the protractor based e2e tests

## Run on docker

* run the containers: `./scripts/start_docker.sh`
* attach to the running resource container: `./scripts/edit_docker.sh`
* see the logs of the running resource container:
** find the container id: `docker ps`
** view the logs: `docker logs <containerId>`
* stop the containers: `./scripts/stop_docker.sh`

Or...

* start with docker-compose: `docker-compose up`

