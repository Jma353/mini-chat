var express = require('express');
var passport = require('passport'); 
var router = express.Router();
var models = require('../models/index'); 
var helpers = require('./helpers'); 

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Index 
router.get('/index', function (req, res, next) {
	passport.authenticate("custom-token", function (err, user, info) {
		if (err) { // 500 error 
			return next(err); 
		} 
		if (!user) { // Couldn't find user with this session 
			return res.json(helpers.responseJSON({ errors: [info.message] }, false));  
		}

		models.user.findAll({ attributes: ['id', 'firstName', 'lastName', 'email']})
		.then(function (users) { 
			var users = users.map(function (u) {
				return u.dataValues;
			}); 
			return res.json(helpers.responseJSON({ users: users }, true)); 

		}); 

	})(req, res, next); 
}); 


// Sign Up Endpoint 
router.post('/sign_up', function (req, res, next) {
	// Flip-flop these fields 
	req.body.user.passwordDigest = req.body.user.password; 
	delete req.body.user.password; 
	models.user
		.create(req.body.user)
		.then(function (user) { 
			return res.json(user.get({ role:'self' })); // Render the user (role indicates what JSON fields are visible)
		})
		.catch(function (errors) {
			return res.json(errors); // Respond with the errors 
		}); 

}); 

// Sign In Endpoint 
router.post('/sign_in', function (req, res, next) {
	passport.authenticate("custom-login", function (err, user, info) {
		if (err) { return next(err) } // Will draw 500
		if (!user) { return res.json({ success: user, data: { errors: [info.message] }}) }
		
		// At this point, we have successfully validated the user 
		models.session.findOrCreate({ where: { userId: user.id }, include: [ { model: models.user, as: 'character' }] })
			.spread(function (session, created) {

				if (!session.dataValues.isActive) {
					// Update it + return 
					session.update({
						sessionCode: session.genSessionCode(), 
						isActive: true 
					}).then(function (session) {
						var sessionCode = session.dataValues.sessionCode; 
						return res.json(helpers.responseJSON({ sessionCode: sessionCode }, true)); 
					}); 
				} 
				// Else, just return 
				else { 
					var sessionCode = session.dataValues.sessionCode; 
					return res.json(helpers.responseJSON({ sessionCode: sessionCode }, true)); 
				}
			}); 


	})(req, res, next); 
	// Need to call authenticate as a function in order for it to return properly 
	// Calling it in this way allow for success or failure decisions 
}); 


// Sign Out Endpoint 
router.post('/sign_out', function(req, res, next) {
	// Grab the session code 
	var sessionCode = req.headers.session_code; 

	models.session.findOne({ where: { sessionCode: sessionCode }})
		.then(function (session) {

			// If no session results
			if (!session) {
				return res.json(helpers.responseJSON({ errors: ["No active session exists with this session code."]}, false)); 
			} 
			// If the session wasn't active to begin with 
			else if (!session.dataValues.isActive) {
				return res.json(helpers.responseJSON({ errors: ["This user is already logged out."]}, false)); 
			} 
			// Actually logging out of the session 
			else { 
				session.update({ isActive: false })
					.then(function (session) {
						return res.json(helpers.responseJSON(null, true)); 
					}); 
			}
		}); 

}); 





module.exports = router;














