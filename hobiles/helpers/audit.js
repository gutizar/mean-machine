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
  audit.on('order-created', saveEventData);
  audit.on('order-modified', saveEventData);
  audit.on('order-status-modified', saveEventData);
  audit.on('comment-added', saveEventData);
}

function saveEventData (data) {
  var event = new Event(data);
  event.save(function (err, event) {
    if (err) { console.error(err); }
    console.log('In the ' + event.name + ' event handler');
  });
}

function scrapOrderData (data) {
  return {
    number: data.number,
    numberWeb: data.numberWeb,
    customerName: data.customerName,
    description: data.description,
    service: data.service,
    sum: data.sum,
    payment: data.payment,
    dispatch: data.dispatch
  };
}

function scrapCommentData (data) {
  return {
    _id: data._id,
    body: data.body,
    createdBy: data.createdBy
  };
}

util.inherits(Audit, EventEmitter);

Audit.prototype.orderCreated = function (order) {
  var eventData = {
    entity: 'Order',
    entityId: order._id,
    name: 'order-created',
    version: order.__v,
    payload: scrapOrderData(order)
  };
  this.emit('order-created', eventData);
};

Audit.prototype.orderUpdated = function (order, data) {
  var eventData = {
    entity: 'Order',
    entityId: order._id,
    name: 'order-modified',
    version: order.__v,
    payload: scrapOrderData(data)
  };
  this.emit('order-modified', eventData);
};

Audit.prototype.statusChanged = function (order, payload) {
  var eventData = {
    entity: 'Order',
    entityId: order._id,
    name: 'order-status-modified',
    version: order.__v,
    payload: payload
  };
  this.emit('order-status-modified', eventData);
};

Audit.prototype.commentAdded = function (order, comment) {
  var eventData = {
    entity: 'Order',
    entityId: order._id,
    name: 'comment-added',
    version: order.__v,
    payload: scrapCommentData(comment)
  };
  this.emit('comment-added', eventData);
};

module.exports = Audit;
