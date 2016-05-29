var express = require('express');
var passport = require('passport'); 
var router = express.Router();
var models = require('../models/index'); 

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

// Going to add passport, doing this for testing for now 
router.post('/sign_in', function (req, res, next) {
	passport.authenticate("custom-login", function (err, user, info) {
		if (err) { return next(err) } // Will draw 500
		if (!user) { return res.json({ success: user, data: { errors: [info.message] }}) }
		return res.json({ success: true }); 
	})(req, res, next); 
	// Need to call authenticate as a function in order for it to return properly 
	// Calling it in this way allow for success or failure decisions 
}); 

module.exports = router;
