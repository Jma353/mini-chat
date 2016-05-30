'use strict'; 

// b/c we passed in app.io 

module.exports = function(io) {

	var express = require('express'); 
	var passport = require('passport'); 
	var router = express.Router(); 
	var models = require('../models/index'); 
	var helpers = require('./helpers'); 
	var path = require('path'); 


	// Just made to test the sockets 
	router.get('/', function (req, res, next) {
		res.sendFile(path.resolve(__dirname + "/../views/index.html")); 
	}); 


	router.post('/create', function (req, res, next) {
		passport.authenticate("custom-token", function (err, user, info) {
			if (err) { // 500 error 
				return next(err); 
			} 
			if (!user) { // Couldn't find user with this session 
				return res.json(helpers.responseJSON({ errors: [info.message] }, false));  
			}

			// If we got here, we're fine
			models.chat.create({ userId: user.id })
				.then(function (chat) {
					return res.json(chat); 
				}); 
		})(req, res, next); 
	}); 



	var nsp = io.of('/chat'); 

	nsp.on("connection", function (socket) {


		socket.on("msg", function (msg) { 
			nsp.emit("msg", msg.myMessage); 
		}); 





	}); 


	// return the router we add routes to 
	return router; 

}