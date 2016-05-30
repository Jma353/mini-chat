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



	// Creation Endpoint 
	router.post('/create', function (req, res, next) {
		passport.authenticate("custom-token", function (err, user, info) {
			if (err) { // 500 error 
				return next(err); 
			} 
			if (!user) { // Couldn't find user with this session 
				return res.json(helpers.responseJSON({ errors: [info.message] }, false));  
			}

			// If we got here, we're fine
			models.chat.create()
				.then(function (chat) {
					// At this point, we have chat
					var usersInChat = req.body.participants.concat(user.id); 

					// From the array of participants, construct array of proper JSON 
					// to instantiate participant models 
					var partJSON = usersInChat.map(function (id) {
						return { 
							chatId: chat.getDataValue('id'), 
							userId: id, 
							isActive: true
						}; 
					});

					models.participant.bulkCreate(partJSON).
					then(function () {
						return res.json(helpers.responseJSON({ chat: chat }, true)); 
					}); 
				}); 
		})(req, res, next); 
	}); 


	// Chat index endpoint 
	router.get('/index', function (req, res, next) {
		passport.authenticate("custom-token", function (err, user, info) {
			if (err) { // 500 error
				return next(err); 
			} 
			if (!user) {
				return res.json(helpers.responseJSON({ errors: [info.message]}, false)); 
			}

			// Find the user's chats 
			models.participant.findAll({ 
				where: { userId: user.id }, 
				include: { model: models.chat, as: 'chat' }
			})
			.then(function (participants) {
				
				// Get the chats 
				var chats = participants.map(function(p) {
					return p.getDataValue('chat'); 
				}); 

				// Return thsose chats 
				return res.json(helpers.responseJSON({ chats: chats }, true))

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