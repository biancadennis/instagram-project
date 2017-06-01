'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		return(queryInterface.createTable('photos', {
			id: {
				type:          Sequelize.INTEGER,
				primaryKey:    true,
				autoIncrement: true,
        allowNull:     false
			},
			caption: {
	    	type:      Sequelize.STRING,
        allowNull: false
			},
			userId: {
      type:         Sequelize.INTEGER,
      allowNull:    false,
      defaultValue: 1
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
