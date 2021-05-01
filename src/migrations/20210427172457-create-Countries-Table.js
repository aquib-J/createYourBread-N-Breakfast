const { Op } = require('sequelize');
const {countryArray}=require('./../../src/utils').utilityMethods;


module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable('countries', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      countryName: {
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
    }).then(async ()=>{
      await queryInterface.bulkInsert('countries',countryArray);
    }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('countries'),
};
