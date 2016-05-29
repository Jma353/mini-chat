'use strict';
var bcrypt = require('bcrypt-nodejs'); 


module.exports = function(sequelize, DataTypes) {

  // to add attr scoping 
  var ssaclAttributeRoles = require('ssacl-attribute-roles'); 
  var user = sequelize.define('user', {});
  ssaclAttributeRoles(sequelize); 
  ssaclAttributeRoles(user);  


  user = sequelize.define('user', {
    // First Name
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
    // Last Name 
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
    // Email 
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
    // Password Hash 
    passwordDigest: {
      type: DataTypes.STRING, 
      allowNull: false, 
      validate: {
        notEmpty: true 
      }, 
      roles: false
    }
  }, {
    // Class Methods 
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }, 
    // Instance Methods 
    instanceMethods: {
      // Make the hash for storage 
      generateHash: function (pass) {
        return bcrypt.hashSync(pass);
      }, 
      // Validate incoming password 
      validPassword: function (pass) { 
        return bcrypt.compareSync(pass, this.dataValues.passwordDigest); 
      }
    }
  });



  // Hooks 
  user.beforeCreate(function (user, options) {
    var hashedPass = user.generateHash(user.dataValues.passwordDigest); 
    user.dataValues.passwordDigest = hashedPass; 
  }); 




  return user;
};











