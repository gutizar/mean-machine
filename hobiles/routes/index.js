var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/partials/:name', function (req, res, next) {
  var name = req.params.name;
  res.render('partials/' + name);
})

module.exports = router;
