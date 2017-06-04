var express       = require('express');
var router        = express.Router();
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var photo          = models.photo;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new', function(request, response) {
	if (true)
		response.render('photoupload/new', {
			post: {}
		});
	else
		response.redirect('/user/log-in');
});

module.exports = router;
