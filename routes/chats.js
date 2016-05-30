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
						models.participant.findAll({ 
							where: { chatId: chat.id }, 
							include: [ { model: models.user, as: 'user' }]
						})
						.then(function (participants) {
							var users = participants.map(function (p) {
								return p.user; 
							}); 
							var data = { chat: chat, users: users };
							return res.json(helpers.responseJSON(data, true)); 
						})
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
					include: [{ model: models.chat, as: 'chat', 
						include: [{ model: models.user }]
				}]
			})
			.then(function (participants) {
				
				// Get the chats 
				var chats = participants.map(function (p) {
					var chat = p.getDataValue('chat'); 
					return chat; 
				}); 

				// Return those chats 
				return res.json(helpers.responseJSON({ chats: chats }, true)); 

			}); 

		})(req, res, next); 
	}); 

	// Get users of a chat 
	router.get('/participants/:chat_id', function (req, res, next) {
		passport.authenticate("custom-token", function (err, user, info) {
			if (err) {
				return next(err); 
			}
			if (!user) {
				return res.json(helpers.responseJSON({ errors: [info.message]}, false)); 
			}

			var chatId = req.params.chat_id; 
			models.participant.findAll({
				where: { chatId: chatId },
				include: [ { model: models.user, as: 'user' }]
			})
			.then(function (participants) {

				var users = participants.map(function (p) {
					var user = p.getDataValue('user'); 
					return user; 
				}); 

				return res.json(helpers.responseJSON({ users: users }, true)); 
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