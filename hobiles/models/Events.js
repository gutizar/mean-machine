var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  entity: String,
  entityId: mongoose.Schema.Types.ObjectId,
  version: { type: Number, default: 0 },
  name: String,
  created: { type: Date, default: Date.Now },
  payload: mongoose.Schema.Types.Mixed
});

EventSchema.pre('save', function (next) {
  this.created = new Date();
  next();
});

mongoose.model('Event', EventSchema);
