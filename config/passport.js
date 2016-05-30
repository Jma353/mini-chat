// config/passport.js 
'use strict'; 

var CustomStrategy = require('passport-custom').Strategy; 
var models = require('../models/index'); 

module.exports = function (passport) {


	passport.use('custom-login', new CustomStrategy(
		function (req, done) {
			models.user.findOne({ where: { email: req.headers.e }})
				.then(function (user) {
					// See if the user doesn't even exist 
					if (!user) {
						done(null, false, { message: "Unknown user" }); 
					}
					// Check for password validitiy 
					var correctPassword = user.validPassword(req.headers.p);
					if (!correctPassword) {
						done(null, false, { message: "Invalid username-password combination" }); 
					} else {
						done(null, user); 
					}
				})
				.catch( function (err) {
					// In this situation, there was an error on the backend 
					done(err, false, { message: "There was an error on the backend" }); 
				})
		}

	)); 

	passport.use('custom-token', new CustomStrategy(
		function (req, done) {
			models.session.findOne({ 
				where: { sessionCode: req.headers.session_code }, 
				include: [{ model: models.user, as: 'character' }]
			})
			.then(function (session) {
				if (!session) {
					done(null, false, { message: "No user exists with that session code." }); 
				} else if (!session.isActive){
					done(null, false, { message: "This session is not active." }); 
				} else { 
					done(null, session.getDataValue('character')); 
				}
			})
			.catch(function (err) { 
				done(err, false, { message: "There was an error on the backend." }); 
			}); 
		}
	)); 

	


}