const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface
      .createTable('payments', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        bookingId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        transactionId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        amount: {
          type: DataTypes.DECIMAL(20, 3),
          allowNull: true,
        },
        paymentStatus: {
          type: DataTypes.ENUM(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']),
          allowNull: false,
          defaultValue: 'PENDING',
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
        await queryInterface.addIndex('payments', ['bookingId'], {
          unique: true,
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        });
      }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('payments'),
};
