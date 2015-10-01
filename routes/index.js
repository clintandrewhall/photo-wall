var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { });
});

router.get('/chromecast', function(req, res, next) {
  res.render('chromecast', { });
});

module.exports = router;
