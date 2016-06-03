// This is critical (to set the environment)
process.env.NODE_ENV = 'test'; 

var request = require('supertest'); 
var express = require('express'); 
var app = require('../app'); 

// Get the db 
var sequelize = require(__dirname + "/../models").sequelize; 

// Assertions 
var chai = require('chai'); 
var expect = chai.expect; 
var should = chai.should(); 


describe("Initial unit test", function () {

	// Before each hook 
	beforeEach(function (done) {
		// Syncs the db + clears it 
		sequelize.sync({ force: true }).then(function (sequelize) {
			done(); 
		}).catch(function (err) {
			throw err; 
		}); 

	}); 


	it("Should be successful signup", function (done) {
		userJson = { 
			user: {
				firstName: "hello", 
				lastName: "world", 
				email: "hello2@world.com",
				password: "password"
			}
		}

		request(app)
			.post('/users/sign_up')
			.send(userJson)
			.end(function (err, res) {
				console.log(res.body); 
				res.status.should.equal(200); 
				done(); 
			}); 


	}); 



}); 