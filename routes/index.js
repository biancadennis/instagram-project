var express       = require('express');
var router        = express.Router();
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var photo         = models.photo;
// for S3
// var uploadHandler = multer();
var uploadHandler = multer({dest: 'public/images/posts'});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index/index', { title: 'Express' });
});

router.get('/new', function(request, response) {
	if (true)
		response.render('photoupload/new', {
			post: {}
		});
	else
		response.redirect('/user/log-in');
});

router.post('/index', uploadHandler.single('image'), function(request, response) {
	photo.create({
		title:         request.body.title,
		// body:          request.body.body,
		slug:          request.body.slug,
		userId:        request.user.id
	}).then(function(photo) {
		sharp(request.file.buffer)
		.resize(300, 300)
		.max()
		.withoutEnlargement()
		.toBuffer()
    .toFile(`${request.file.path}-thumbnail`, function() {
			response.redirect(post.url);
		});
		// .then(function(thumbnail) {
		// 	s3.upload({
		// 		Bucket:     'instagram',
		// 		Key:        `photo/${photo.id}`,
		// 		Body:        request.file.buffer,
		// 		ACL:        'public-read',
		// 		ContentType: request.file.mimetype
		// 	}, function(error, data) {
		// 		s3.upload({
		// 			Bucket:     'instagram',
		// 			Key:        `photo/${photo.id}-thumbnail`,
		// 			Body:        thumbnail,
		// 			ACL:        'public-read',
		// 			ContentType: request.file.mimetype
		// 		}, function(error, data) {
		// 			response.redirect(photo.url);
		// 		});
		// 	});
		// });
	}).catch(function(error) {
		response.render('photoupload/new', {
			// post:   request.body,
			errors: error.error
		});
	});
});


module.exports = router;
