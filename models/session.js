'use strict';

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
    }
  });

  return session;
};