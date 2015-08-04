var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var Comment = mongoose.model('Comment');

var Audit = require('../helpers/audit');
var audit = new Audit();

router.param('order', function (req, res, next, id) {
  var query = Order.findById(id);
  query.exec(function (err, order) {
    if (err) { return next(err); }
    if (!order) {
      return next(new Error('Could not find order with ID ' + id));
    }
    req.order = order;
    return next();
  });
});

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
  Order.find(function (err, orders) {
    if (err) { return next(err) };
    res.json(orders);
  });
});

router.get('/:order', function (req, res) {
  req.order.populate('comments', function (err, order) {
    if (err) { return next(err); }
    res.json(order);
  });
});

router.get('/:order/comments', function (req, res) {
  req.order.populate('comments', function (err, order) {
    if (err) { return next(err); }
    res.json(order.comments);
  });
});

router.get('/:order/comments/:comment', function (req, res) {
  res.json(req.comment._id);
});

router.delete('/:order/comments/:comment', function (req, res, next) {
  // Remove the comment from the order
  req.order.comments.pull({
    _id: req.comment._id
  });

  req.order.save(function (err, order ) {
    if (err) { return next(err); }

    req.comment.remove(function (err) {
      if (err) { return next(err); }
      res.json(order);
    });
  });
});

router.post('/:order/comments', function (req, res, next) {
  var comment = new Comment(req.body);
  comment.order = req.order;
  comment.save(function (err, comment) {
    if (err) { return next(err); }
    req.order.comments.push(comment);
    req.order.save(function (err, order) {
      if (err) { return next(err); }
      audit.commentAdded(order, comment);
      res.json(comment);
    });
  });
});

router.post('/', function (req, res, next) {
  var order = new Order(req.body);
  order.save(function (err, order) {
    if (err) { return next(err) }
    res.json(order);
  });
});

router.post('/:order', function (req, res, next) {
  Order.update({ _id: req.order._id }, req.body, { runValidators: true },
    function (err, raw) {
      if (err) { return next(err); }
      audit.orderUpdated(req.order, req.body);
      res.json(raw);
    });
});

router.put('/:order/toggle', function (req, res, next) {
  req.order.toggle(function (err, order) {
    if (err) { return next(err) };
    res.json(order);
  });
});

router.put('/:order/status', function (req, res, next) {
  var previousState = req.order.status;
  var nextState = req.body;
  var statusChangePayload = {
    previousState: previousState.name,
    nextState: nextState.name,
    lifecycle: previousState.lifecycle
  };
  Order.update(
    { _id: req.order._id },
    { status: {
        name: nextState.name,
        label: nextState.label,
        lifecycle: previousState.lifecycle
      },
      updated: new Date()
    },
    { runValidators: false},
    function (err, raw) {
      if (err) { return next(err); }
      audit.statusChanged(req.order, statusChangePayload);
      res.json(raw);
    });
});

module.exports = router;
