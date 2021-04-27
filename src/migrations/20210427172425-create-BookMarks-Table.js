const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable('bookmarks', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      listingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('bookmarks'),
};
