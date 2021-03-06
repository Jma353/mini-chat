'use strict';
var bcrypt = require('bcrypt-nodejs'); 

module.exports = function(sequelize, DataTypes) {

  var user = sequelize.define('user', {
    // First Name
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    // Last Name 
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true 
      }
    },
    // Email 
    email: {
      type: DataTypes.STRING,
      validate: { 
        isEmail: true, 
        isUnqiue: sequelize.validateIsUnique('email') 
      }
    },
    // Password Hash 
    passwordDigest: {
      type: DataTypes.STRING, 
      allowNull: false, 
      validate: {
        notEmpty: true 
      }
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
      }, 
      toJSON: function () {
        var repr = this.dataValues; 
        delete repr.passwordDigest; 
        return repr; 
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











