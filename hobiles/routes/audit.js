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
  audit.on('status-change', function (id, version, payload) {
    var event = new Event({
      entity: 'Order',
      entityId: id,
      name: 'status-change',
      version: version,
      payload: payload
    });
    event.save(function (err, event) {
      if (err) { console.error(err); }
      console.log('In the status-change event handler');
      console.log(event);
    });
  });

  audit.on('order-modify', function (id, version, payload) {
    var event = new Event({
      entity: 'Order',
      entityId: id,
      name: 'order-modify',
      version: version,
      payload: payload
    });
    event.save(function (err, event) {
      if (err) { console.error(err); }
      console.log('In the order-modify event handler');
      console.log(event);
    });
  });
}

util.inherits(Audit, EventEmitter);

Audit.prototype.orderUpdated = function (order, data) {
  this.emit('order-modify', order._id, order.__v++, data);
};

Audit.prototype.statusChanged = function (order, status) {
  this.emit('status-change', order._id, order.__v++, status);
};

module.exports = Audit;
