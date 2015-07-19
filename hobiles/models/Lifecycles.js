var mongoose = require('mongoose');

var LifeCycleSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		unique: true
	},
	created: { type: Date, default: Date.Now },
	states: [{
		name: { type: String, trim: true },
		label: String,
		seq: {type: Number, default: 0 }
	}]
});

LifeCycleSchema.pre('save', function (next) {
	this.created = new Date();
	next();
});

mongoose.model('Lifecycle', LifeCycleSchema);