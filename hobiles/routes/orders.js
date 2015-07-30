var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var Comment = mongoose.model('Comment');

var events = require('events');
var eventEmitter = new events.EventEmitter();

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
  var status = req.order.status;
  Order.update({ _id: req.order._id },
    { status: {
        lifecycle: status.lifecycle,
        name: req.body.name,
        label: req.body.label
      },
      updated: new Date()
    },
    { runValidators: false},
    function (err, raw) {
      if (err) { return next(err); }
      eventEmitter.emit('status-change', status);
      res.json(raw);
    });
});

eventEmitter.on('status-change', function (data) {
  console.log('Inside the status-change event handler');
  console.log(data);
});

module.exports = router;
