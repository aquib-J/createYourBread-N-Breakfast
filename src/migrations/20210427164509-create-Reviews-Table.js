const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface
      .createTable('reviews', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        bookingId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue:null,
        },
        rating: {
          type: DataTypes.DECIMAL(5,2),
          allowNull: true,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        byHost:{
            type:DataTypes.BOOLEAN
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
        await queryInterface.addIndex('reviews', ['bookingId'], {
          unique: true,
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        });
      }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('reviews'),
};
