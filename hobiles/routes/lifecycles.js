var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Lifecycle = mongoose.model('Lifecycle');

router.param('lifecycle', function (req, res, next, name) {
  var query = Lifecycle.findBy({
    'name': name
  });
  query.exec(function (err, lifecycle) {
    if (err) { return next(err); }
    if (!lifecycle) {
      return next(new Error('Could not find lifecycle with name ' + name));
    }
    req.lifecycle = lifecycle;
    return next();
  });
});

router.get('/', function (req, res, next) {
  Lifecycle.find(function (err, lifecycles) {
    if (err) { return next(err); }
    res.json(lifecycles);
  });
});

router.get('/:lifecycle', function (req, res, next) {
  res.json(req.lifecycle);
});

router.get('/:lifecycle/states', function (req, res, next) {
  res.json(req.lifecycle.states);
});