const { Op } = require('sequelize');
const {stateArray}=require('./../../src/utils').utilityMethods;

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable('states', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stateName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countryId: {
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
    }).then(async ()=>{
      await queryInterface.bulkInsert('states',stateArray);
    }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('states'),
};
