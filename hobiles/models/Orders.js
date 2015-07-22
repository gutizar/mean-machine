var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  number: {
    type: String,
    trim: true,
    unique: true,
    uppercase: true,
    match: [
      /\d{4}\/\d{6}/,
      "Order number must have the format yyyy-xxxxxx ({VALUE})"
    ]
  },
  numberWeb: String,
  customerName: String,
  description: String,
  service: String,
  partListNumber: String,
  dispatch: String,
  dueDate: { type: Date, default: Date.Now },
  created: { type: Date, default: Date.Now },
  updated: { type: Date, default: Date.Now },
  createdBy: String,
  updatedBy: String,
  payment: String,
  sum: { type: Number, default: 0 },
  status: {
    name: String,
    lifecycle: String
  },
  important: { type: Boolean, default: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

OrderSchema.pre('save', function (next) {
  this.created = new Date();
  this.updated = new Date();
  next();
});

OrderSchema.pre('update', function () {
  this.update({}, { $set: { updated: new Date() } });
});

OrderSchema.methods.toggle = function (cb) {
    this.important = !this.important;
    this.save(cb);
};

mongoose.model('Order', OrderSchema);
