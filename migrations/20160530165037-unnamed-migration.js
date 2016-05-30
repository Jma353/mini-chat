'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // To add on update / delete cascading 
    queryInterface.changeColumn('participants', 'userId', {
      type: Sequelize.INTEGER, 
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }); 
    // To add on update / delete cascading 
    queryInterface.changeColumn('participants', 'chatId', {
      type: Sequelize.INTEGER, 
      references: {
        model: 'chats',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }); 

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
