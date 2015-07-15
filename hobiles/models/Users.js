var mongoose = require('mongoose');
var crypto = require('crypto');
var jsonwebtoken = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
  email: {
    type: mongoose.SchemaTypes.Email,
    validate: [ required, 'Email required' ],
    index: { unique: true }
  },
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 100, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 100, 64).toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jsonwebtoken.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getDate() / 1000)
  }, 'SECRET');
};

mongoose.model('User', UserSchema);
