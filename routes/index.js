var express = require('express');
var router = express.Router();
const getDB = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/index_chart', function(req, res, next) {
  res.render('index_chart', { title: 'Express' });
});

router.get('/db/:stmt', function(req, res, next) {
  res.json(getDB(req.params.stmt));
});


module.exports = router;
