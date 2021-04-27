const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable('cities', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      cityName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stateId: {
        type: DataTypes.INTEGER,
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

  down: (queryInterface, DataTypes) => queryInterface.dropTable('cities'),
};
