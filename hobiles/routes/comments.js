var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

router.param('comment', function (req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment) {
    if (err) { return next(err); }
    if (!comment) {
      return next(new Error('Could not find comment with ID ' + id));
    }
    req.comment = comment;
    return next();
  });
});

router.get('/', function (req, res, next) {
  Comment.find(function (err, comments) {
    if (err) { return next(err); }
    res.json(comments);
  });
});

router.post('/', function (req, res, next) {
  var comment = new Comment(req.body);
  comment.save(function (err, comment) {
    if (err) { return next(err) };
    res.json(comment);
  });
});

router.post('/:comment', function (req, res, next) {
  Comment.update({ _id: req.comment._id }, req.body, function (err, raw) {
    if (err) { return next(err); }
    res.json(raw);
  });
});

router.put('/:comment/toggle', function (req, res, next) {
  req.comment.toggle(function (err, comment) {
    if (err) { return next(err); }
    res.json(comment);
  })
});

router.put('/:comment/upvote', function (req, res, next) {
  req.comment.upvote(function (err, comment) {
    if (err) { return next(err); }
    res.json(comment);
  })
});

module.exports = router;
