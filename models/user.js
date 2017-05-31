var express  = require('express');
var passport = require('passport');
var local    = require('passport-local');
var bcrypt   = require('bcrypt');
var models   = require('../models/index');
var User     = models.user;
var router   = express.Router();

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
	response.render('user/sign_up', {
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
				response.redirect('/');
			});
		}).catch(function(error) {
			response.render('user/sign_up', {
				user:   request.body,
				errors: error.errors
			});
		});
	});
});

// Log in.
router.get('/log-in', function(request, response) {
	response.render('user/log_in')
});

router.post('/log-in', passport.authenticate('local'), function(request, response) {
	response.redirect('/');
});

// Log out.
router.get('/log-out', function(request, response) {
	request.logout();
	response.redirect('/');
});
