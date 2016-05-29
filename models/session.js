'use strict';
var crypto = require('crypto'); 

module.exports = function(sequelize, DataTypes) {
  var session = sequelize.define('session', {
    // Reference to user 
    userId: {
      type: DataTypes.INTEGER, 
      references: {
        model: 'users',
        key: 'id'
      }
    },
    // Session Code 
    sessionCode: DataTypes.STRING,
    // Is active boolean 
    isActive: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }, 
    // Instance methods 
    instanceMethods: { 
      // Generate a sessionCode
      genSessionCode: function () {
        return crypto.randomBytes(64).toString('hex'); 
      }
    }
  });

  // Hooks 
  // Initial values
  session.beforeCreate(function (session, options) {
    session.dataValues.sessionCode = session.genSessionCode(); 
    session.dataValues.isActive = true; 
  }); 



  return session;
};