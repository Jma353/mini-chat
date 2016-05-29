'use strict';
var bcrypt = require('bcrypt-nodejs'); 

module.exports = function(sequelize, DataTypes) {

  // to add attr scoping 
  var ssaclAttributeRoles = require('ssacl-attribute-roles'); 
  var user = sequelize.define('user', {});
  ssaclAttributeRoles(sequelize); 
  ssaclAttributeRoles(user);  


  user = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }, 
      roles: { 
        self: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true 
      }, 
      roles: {
        self: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: { 
        isEmail: true, 
        isUnqiue: sequelize.validateIsUnique('email') 
      }, 
      roles: {
        self: true
      }
    },
    passwordDigest: {
      type: DataTypes.STRING, 
      allowNull: false, 
      validate: {
        notEmpty: true 
      }, 
      roles: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }, 
    instanceMethods: {
      generateHash: function (pass) {
        return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
      } 
    }
  });

  
  // beforeCreate hook 
  user.beforeCreate(function (user, options) { 
    var hashedPass = user.generateHash(user.passwordDigest); 
    user.passwordDigest = hashedPass; 
  }); 


  return user;
};











