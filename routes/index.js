var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/index_chart', function(req, res, next) {
  res.render('index_chart', { title: 'Express' });
});


module.exports = router;
