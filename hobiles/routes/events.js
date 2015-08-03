var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Event = mongoose.model('Event');

router.get('/:entity', function (req, res, next) {
  Event.find(
    { entityId: req.params.entity }
  ).sort(
    { created: -1 }
  ).exec(function (err, data) {
    if (err) { return next(err); }
    res.json(data);
  });
});

module.exports = router;
