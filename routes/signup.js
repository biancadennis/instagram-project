var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
	response.render('signup/index');
});

module.exports = router;
