var express       = require('express');
var router        = express.Router();
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var Photo         = models.photo;
var User     = models.user;
// for S3
// var uploadHandler = multer();
// var uploadHandler = multer({dest: 'public/images/photos'});



// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index/index', { title: 'Express' });
// });

// router.get('/new', function(request, response) {
// 	if (true)
// 		response.render('photoupload/new', {
// 			photo: {}
// 		});
// 	else
// 		response.redirect('/users/log-in');
// });

// router.post('/index', uploadHandler.single('image'), function(request, response) {
// 	Photo.create({
// 		title:         request.body.title,
// 		// body:          request.body.body,
// 		slug:          request.body.slug,
// 		userId:        request.user.id
// 	}).then(function(photo) {
// 		sharp(request.file.buffer)
// 		.resize(300, 300)
// 		.max()
// 		.withoutEnlargement()
// 		.toBuffer()
//     .toFile(`${request.file.path}-thumbnail`, function(photoo) {
// 			// response.redirect(post.url);
//       response.render('photoupload/new', {
//         photo: photo
//       });
// 		});

// 		// .then(function(thumbnail) {
// 		// 	s3.upload({
// 		// 		Bucket:     'instagram',
// 		// 		Key:        `photo/${photo.id}`,
// 		// 		Body:        request.file.buffer,
// 		// 		ACL:        'public-read',
// 		// 		ContentType: request.file.mimetype
// 		// 	}, function(error, data) {
// 		// 		s3.upload({
// 		// 			Bucket:     'instagram',
// 		// 			Key:        `photo/${photo.id}-thumbnail`,
// 		// 			Body:        thumbnail,
// 		// 			ACL:        'public-read',
// 		// 			ContentType: request.file.mimetype
// 		// 		}, function(error, data) {
// 		// 			response.redirect(photo.url);
// 		// 		});
// 		// 	});
// 		// });
// 	}).catch(function(error) {
// 		response.render('photoupload/new', {
// 			errors: error.error
// 		});
// 	});
// });
router.get('/', function(request, response) {
	Photo.findAll({include: User}).then(function(photos) {
		response.render('user/photos', {
			photos: photos
		});
	});
});
module.exports = router;
