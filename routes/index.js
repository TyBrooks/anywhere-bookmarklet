var express = require('express');
var router = express.Router();

// Enable CORS for sharing resources with bookmarklet on other domains 
router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/bookmarklet', function(req, res) {
  res.render('html_bookmarklet');
});

// Fake API

router.get('/account/users', function(req, res) {
  res.render('fake_api/user_data')
});

router.get('/api/link', function(req, res) {
  res.render('fake_api/link_data')
})

// Preview

router.get('/preview', function(req,res) {
  res.render('preview/bookmarklet', { title: "Bookmarklet Preview" });
});

router.get('/preview/login', function(req,res) {
  res.render('preview/login', { title: "Login page preview" });
});


module.exports = router;
