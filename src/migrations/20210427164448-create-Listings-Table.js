const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface
      .createTable('listings', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        listingName: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        pricePerDay: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
        },
        miscCostPercentage: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: true,
          defaultValue: 0.0,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        avgRating: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 5.0,
        },
        features: {
          type: DataTypes.JSONB,
          defaultValue: null,
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
        await queryInterface.addIndex('listings', ['listingName'], {
          unique: true,
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        });
      }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('listings'),
};
