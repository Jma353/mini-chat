'use strict';

module.exports = function(sequelize, DataTypes) {
  var participant = sequelize.define('participant', {
    // Reference to user 
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    // Reference to chat 
    chatId: {
      type: DataTypes.INTEGER, 
      references: {
        model: 'chats',
        key: 'id'
      }
    },
    // Is active boolean 
    isActive: DataTypes.BOOLEAN 
  }, {
    // Class methods 
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  // Hooks 
  // Initial values
  participant.beforeCreate(function (participant, options) {
    participant.setDataValue('isActive', true); 
  }); 


  return participant;
};