
/**
 * Module dependencies
 */

var express = require('express'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  multer = require('multer'),
  errorHandler = require('errorhandler'),
  routes = require('./routes'),
  api = require('./routes/api'),
  search = require('./routes/api/search'),
  util = require('./routes/api/util'),
  file = require('./routes/api/file'),
  typeAheadFieldData = require('./routes/api/typeAheadFieldData'),
  generatecv = require('./routes/api/generatecv'),
  login = require('./routes/api/login'),
  registration = require('./routes/api/registration'),
  personnel = require('./routes/api/personnel'),
  workflow = require('./routes/api/workflow'),
  report = require('./routes/api/report'),
  job = require('./routes/api/job'),
  http = require('http'),
  path = require('path'),
  morgan = require('morgan'),
  jwt = require('jsonwebtoken'),
  _ = require('lodash');
//   db = require('./routes/database');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments

// development only
if (app.get('env') === 'development') {
  app.use(require('connect-livereload')({port: 35729}));
}

// production only
if (app.get('env') === 'production') {
  app.use(morgan(':date :method :url :status :res[content-length] - :response-time ms'));
}

app.set('port', process.env.PORT || 9200);
app.set('views', __dirname + '/components');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false, limit: 500000 }));
app.use(bodyParser.json());

//app.use(express.json());
//app.use(express.urlencoded({ extended: false, limit: 500000 }));
app.use(multer({ dest: './uploads/' }));

app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'components')));
app.use(express.static(path.join(__dirname, 'components', 'web')));
app.use(express.static(path.join(__dirname, 'templates')));
app.use('/test', express.static(__dirname + '/test'));

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

var apiRoutes = express.Router(); 


/*
app.post('/login', function (req, res, next) {
  login.loginUser(req, res);
});
*/


apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];
  token = token ? token.split(' ')[1] : undefined;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'iwouldreallylikeanewbike', function(err, decoded) {
      if (err) {
        return res.status(403).send({ 
          success: false, 
          message: 'Token expired.' 
        });   
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

/**
 * Routes
 */

 var callback = function() {
   // noop
 };

// serve index and view partials
app.get('/', routes.index);


app.get('/partials/:component/:name', routes.partials);
app.use('/api', apiRoutes);

// route to test if the user is logged in or not
app.get('/api/loggedin', function(req, res) {
  res.send(req.decoded);
});


app.use('/', login);
app.use('/api', login);
app.use('/', registration);
app.use('/api', search);
app.use('/api', personnel);
app.use('/api', workflow);
app.use('/api', generatecv);
app.use('/api', typeAheadFieldData);
app.use('/api', job);
app.use('/api', file);
app.use('/api', util);
app.use('/api', report);



// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

function serverClose (e) {
  if(server) {
    console.log(e.stack);

    server.close();
    console.log('Server has shutdown.');
  }
}

process.on('exit', serverClose);
process.on('uncaughtException', serverClose);
process.on('SIGTERM', serverClose);