var express = require('express');
var router = express.Router();

// Enable CORS for sharing resources with bookmarklet on other domains 
router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

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
