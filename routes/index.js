var dotenv = require('dotenv').config();

var express = require('express');
var router = express.Router();


router.index = function(req, res, next) {
  res.render('index');
};


router.partials = function (req, res) {
  var component = req.params.component;
  var name = req.params.name;
  
   res.render(component + '/views/' + name);
};


module.exports = router;


