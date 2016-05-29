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


}