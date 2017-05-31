'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return(queryInterface.createTable('comments', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
        allowNull:     false
      },
      photoId: {
        type:      Sequelize.INTEGER,
        allowNull: false
      },
      body: {
        type:      Sequelize.TEXT,
        allowNull: false
      },
      author: {
        type:      Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    }));
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
