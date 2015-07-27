var _ = require('underscore');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Lifecycle = mongoose.model('Lifecycle');

router.param('lifecycle', function (req, res, next, name) {
  var query = Lifecycle.findOne({
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

router.get('/:lifecycle/promote/:state', function (req, res, next) {
  var current = _.find(req.lifecycle.states, function (item) {
    return item.name == req.params.state;
  });

  var nextStates = _.filter(req.lifecycle.states, function (item) {
    return item.seq > current.seq;
  });

  res.json(nextStates);
});

router.get('/:lifecycle/demote/:state', function (req, res, next) {
  var current = _.find(req.lifecycle.states, function (item) {
    return item.name == req.params.state;
  });

  var prevStates = _.filter(req.lifecycle.states, function (item) {
    return item.seq < current.seq;
  });

  res.json(prevStates);
});

module.exports = router;
