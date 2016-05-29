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
			res.json(user); // Create the user
		})
		.catch(function (errors) {
			res.json(errors); // Respond with the errors 
		}); 

})

module.exports = router;
