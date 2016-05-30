'use strict';
var crypto = require('crypto'); 

module.exports = function(sequelize, DataTypes) {
  var chat = sequelize.define('chat', {
    // Namespace of the chat 
    namespace: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }, 
    // Instance Methods
    instanceMethods: {
      // Generate a namespace 
      genNamespace: function () {
        return crypto.randomBytes(20).toString('hex'); 
      }
    }
  });

  // Hooks 
  // Initial values
  chat.beforeCreate(function (chat, options) {
    var nsp = chat.genNamespace(); 
    chat.setDataValue('namespace', nsp); 
  }); 

  return chat;
};