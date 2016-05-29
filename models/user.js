'use strict';
var bcrypt = require('bcrypt'); 

module.exports = function(sequelize, DataTypes) {

  var user = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true 
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: { 
        isEmail: true, 
        isUnqiue: sequelize.validateIsUnique('email') 
      }
    },
    passwordDigest: {
      type: DataTypes.STRING, 
      allowNull: false, 
      validate: {
        notEmpty: true 
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }, 
    instanceMethods: {
      toJSON: function () {
        var repr = this.dataValues; 
        delete repr.passwordDigest; 
        return { user: repr }; 
      }
    }
  });

  // beforeCreate hook 
  user.beforeCreate(function (user, options) {
    var saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS); 
    var hashedPass = bcrypt.hashSync(user.passwordDigest, saltRounds); 
    user.passwordDigest = hashedPass
  }); 


  return user;
};











