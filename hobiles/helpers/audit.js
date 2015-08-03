var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

var mongoose = require('mongoose');
var Event = mongoose.model('Event');

function Audit () {
  EventEmitter.call(this);
  subscribeToEvents(this);
}

function subscribeToEvents (audit) {
  audit.on('status-change', function (data) {
    var event = new Event(data);
    event.save(function (err, event) {
      if (err) { console.error(err); }
      console.log('In the status-change event handler');
      console.log(event);
    });
  });

  audit.on('order-modify', function (data) {
    var event = new Event(data);
    event.save(function (err, event) {
      if (err) { console.error(err); }
      console.log('In the order-modify event handler');
      console.log(event);
    });
  });
}

util.inherits(Audit, EventEmitter);

Audit.prototype.orderUpdated = function (order, data) {
  data.comments = [];
  var eventData = {
    entity: 'Order',
    entityId: order._id,
    name: 'order-modify',
    version: order.__v++,
    payload: data
  };
  this.emit('order-modify', eventData);
};

Audit.prototype.statusChanged = function (order, payload) {
  var eventData = {
    entity: 'Order',
    entityId: order._id,
    name: 'status-change',
    version: order.__v++,
    payload: payload
  };
  this.emit('status-change', eventData);
};

module.exports = Audit;
