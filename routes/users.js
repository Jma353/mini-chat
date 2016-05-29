var express = require('express');
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
			res.json(user.get({ role:'self' })); // Render the user (role indicates what JSON fields are visible)
		})
		.catch(function (errors) {
			res.json(errors); // Respond with the errors 
		}); 

}); 

// Going to add passport, doing this for testing for now 
router.post('/sign_in', function (req, res, next) {
	var email = req.body.user.email; 
	var password = req.body.user.password; 	
	models.user.findOne({ where: { email: email }}).
		then(function (user) {
			var validPass = user.validPassword(password); 
			res.json({ success: validPass }); 
		}); 

}); 

module.exports = router;
