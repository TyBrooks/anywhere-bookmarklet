var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/preview', function(req,res) {
  res.render('bookmarklet', { title: "Bookmarklet Preview" });
})

router.get('/bookmarklet', function(req, res) {
  res.render('html_bookmarklet');
})

module.exports = router;
