var express = require('express');
var passport = require('passport'); 
var router = express.Router();
var models = require('../models/index'); 
var helpers = require('./helpers'); 

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

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


router.post('/sign_in', function (req, res, next) {
	passport.authenticate("custom-login", function (err, user, info) {
		if (err) { return next(err) } // Will draw 500
		if (!user) { return res.json({ success: user, data: { errors: [info.message] }}) }
		
		// At this point, we have successfully validated the user 
		models.session.findOrCreate({ where: { userId: user.id }, include: [ { model: models.user, as: 'character' }] })
			.spread(function (session, created) {

				// This demonstrates eager loading / pulling a foreign relation in this framework 
				console.log("this is the session's character");
				console.log(session.dataValues.character.dataValues.email); 

				if (!session.dataValues.isActive) {
					// Update it + return 
					session.update({
						sessionCode: session.genSessionCode(), 
						isActive: true 
					}).then(function (session) {
						var sessionCode = session.dataValues.sessionCode; 
						return res.json(helpers.responseJSON({ sessionCode: sessionCode }, true)); 
					})
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







module.exports = router;














