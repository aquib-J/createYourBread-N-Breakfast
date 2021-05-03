const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface
      .createTable('bookings', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        listingId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        paymentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        checkInDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        checkOutDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.DECIMAL(20, 2),
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
        await queryInterface.addIndex('bookings', ['userId', 'paymentId'], {
          unique: true,
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        });
      }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('bookings'),
};
