var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  created: { type: Date, default: Date.Now },
  createdBy: String,
  upvotes: { type: Number, default: 0 },
  important: { type: Boolean, default: false },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
});

CommentSchema.pre('save', function (next) {
  this.created = new Date();
  next();
});

CommentSchema.methods.upvote = function (cb) {
  this.upvotes++;
  this.save(cb);
};

CommentSchema.methods.toggle = function (cb) {
    this.important = !this.important;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);
