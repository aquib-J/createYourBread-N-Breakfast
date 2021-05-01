const { Op } = require('sequelize');
const { FILL_CITY_STATE_COUNTRY } = require('./../../src/utils').utilityMethods;

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface
      .createTable('cities', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
      })
      .then(async () => {
        const  {cityArray}=await FILL_CITY_STATE_COUNTRY();
        await queryInterface.bulkInsert('cities', cityArray);
      }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('cities'),
};
