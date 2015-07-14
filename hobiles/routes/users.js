var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all the fields'
    });
  }

  var user;
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function (err) {
    if (err) { return next(err); }
    return res.json({
      token: user.generateJWT()
    });
  });
});

module.exports = router;
