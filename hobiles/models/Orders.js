var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  number: String,
  numberWeb: String,
  customerName: String,
  description: String,
  service: String,
  partListNumber: String,
  dispatch: {
    name: String, label: String
  },
  created: { type: Date, default: Date.Now },
  updated: { type: Date, default: Date.Now },
  createdBy: String,
  updatedBy: String,
  payment: {
    name: String, label: String
  },
  sum: { type: Number, default: 0 },
  status: {
    name: String,
    lifecycle: String
  },
  important: Boolean,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

OrderSchema.methods.toggle = function (cb) {
    this.important = !this.important;
    this.save(cb);
};

mongoose.model('Order', OrderSchema);
