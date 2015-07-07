var mongoose = require('mongoose');

var StateSchema = new mongoose.Schema({
  name: String,
  display: String,
  prev: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  next: [{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }]
});

mongoose.model('State', StateSchema);
