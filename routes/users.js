var express  = require('express');
var multer   = require('multer');
var sharp    = require('sharp');
var passport = require('passport');
var local    = require('passport-local');
var bcrypt   = require('bcrypt');
var models   = require('../models/index');
var aws      = require('aws-sdk');
var User     = models.user;
var Comment  = models.comment;
var Photo		 = models.photo;
var router   = express.Router();
var uploadHandler = multer();
var s3            = new aws.S3({region: 'us-east-1'});

// Passport.
passport.use(
	new local.Strategy(
		function(email, password, done) {
	    User.findOne({
				where: {
					email: email
				}
			}).then(function(user) {
	      if (!user)
	        return(done(null, false, {message: 'A user with that email does not exist.'}));
	      else {
					bcrypt.compare(password, user.password, function(error, result) {
						if (result)
				      return(done(null, user));
						else
			        return(done(null, false, {message: 'Incorrect password.'}));
        	});
				}
	    });
	  }
	)
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user);
  });
});

// Sign up.
router.get('/sign-up', function(request, response) {
	response.render('signup', {
		user: {}
	})
});

router.post('/sign-up', function(request, response) {
	bcrypt.hash(request.body.password, 10, function(error, password) {
		User.create({
			email:    request.body.email,
			password: password,
			name:     request.body.name
		}).then(function(user) {
			request.login(user, function(error) {
				response.redirect(`/users/${request.user.id}`);
			});
		}).catch(function(error) {
			response.render('signup', {
				user:   request.body,
				errors: error.errors
			});
		});
	});
});

// Log in.
router.get('/log-in', function(request, response) {
	response.render('users/log_in')
});

router.post('/log-in', passport.authenticate('local'), function(request, response) {
	response.redirect(`/users/${request.user.id}`);
});

// New.
router.get('/upload-photo', function(request, response) {
	if (request.user)
		response.render('photoupload/new', {
			photo: {}
		});
	else {
		response.redirect('/users/log-in');
	}
});

//Upload a photo
router.post('/upload-photo', uploadHandler.single('image'), function(request, response) {
	// console.log('req the body');
	// console.log(request.body.tags);
	// console.log('type of userID', typeof request.user.id);
	Photo.create({
		caption:       request.body.caption,
		userId:        request.user.id,
		hashtags:      request.body.tags
	}).then(function(photo) {
		sharp(request.file.buffer)
		.resize(300, 300)
		.max()
		.withoutEnlargement()
		.toBuffer()
		.then(function(thumbnail) {
			s3.upload({
				Bucket:     'timber-nycda',
				Key:        `photos/${photo.id}`,
				Body:        request.file.buffer,
				ACL:        'public-read',
				ContentType: request.file.mimetype
			}, function(error, data) {
				if (error) {
					console.log('error', error);
				}
				s3.upload({
					Bucket:     'timber-nycda',
					Key:        `photos/${photo.id}-thumbnail`,
					Body:        thumbnail,
					ACL:        'public-read',
					ContentType: request.file.mimetype
				}, function(error, data) {
					console.log('s3=>', data);
					response.redirect(`/users/photo/${photo.id}`);
				});
			});
		});
	}).catch(function(error) {
		response.render('photoupload/new', {
			photo:   request.body,
			errors: error.errors
		});
	});
});

//Deletes a photo
router.get('/photo/:id/delete', function(request,response) {
	console.log('delete route')
	Photo.findOne({
		where: {
			id: request.params.id
		}
	}).then(function(photo){
		photo.destroy().then(function() {
			response.redirect(`/users/${request.user.id}`)
			console.log('deleted');
		});
	});
});

//Update Photo
router.get('/photo/:id/update', function(request, response) {
	if (request.user) {
		Photo.findOne({
			where: {
				id: request.params.id
			}
		}).then(function(photo){
			response.render('photoupload/show-new', {
				photo:			photo,
				caption:		request.body.caption,
				userId:			request.user.id
			});
		})
	}
	else {
		response.redirect('/users/log-in');
	}
});

router.post('/photo/:id/update', function(request, response) {
	Photo.findOne({
		where: {
			id: request.params.id
		}
	}).then(function(photo){
		console.log(request.body);
		console.log(request.body.caption);
		photo.update({
			caption:       request.body.caption,
			userId:        request.user.id
		}).then(function(error, data) {
			response.redirect(`/users/photo/${photo.id}`)
		})
	}).catch(function(error) {
		response.render('photoupload/new', {
			photo:   request.body,
			errors: error.errors
		});
	});
});


//end of update
router.get('/photo/:id', function(request, response) {
    Photo.findById(request.params.id, {
			include: [
				Comment
			]
		}).then(function(photo) {
        response.render('photoupload/show', {
            photo: photo
        });
    });
});
router.get('/photo/:id', function(request, response) {
    Photo.findById(request.params.id, {
			include: [
				Comment
			]
		}).then(function(photo) {
			// console.log('photooooooo');
			// console.log(photo);
        response.render('photoupload/show', {
            photo: photo,
						hashtags: photo.hashtags
        });
    });
});
router.post('/photo/:id/comments', function(request, response) {
	Photo.findById(request.params.id).then(function(photo) {
		photo.createComment({
			body:   request.body.body,
			author: request.body.author
		}).then(function(comment) {
			response.redirect(`/users/photo/${photo.id}`);
		});
	});
});

// Photo Tags
router.get('/photos/:tags', function(request, response) {
	console.log(request.params.tags);
	Photo.findAll({
		where: {
			hashtags: request.params.tags
		}
	}).then(function(photosWithTags) {
		response.render('photo/photo', {
			photos: photosWithTags
		})
	})
});


// Log out.
router.get('/log-out', function(request, response) {
	request.logout();
	response.redirect('/');
});



//User Page
router.get('/:id', function(request, response) {
  User.findById(request.params.id).then(function(user) {
    Photo.findAll({include: User}).then(function(photos) {
      response.render('user/userpage', {
        user: user,
        photos: photos
      });
    });
  });
});

//view photos
// router.get('/', function(request, response) {
// 	Photo.findAll({include: User}).then(function(photos) {
// 		response.render('user/userpage', {
// 			user: user,
// 			photos: photos
// 		});
// 	});
// });


module.exports = router;
