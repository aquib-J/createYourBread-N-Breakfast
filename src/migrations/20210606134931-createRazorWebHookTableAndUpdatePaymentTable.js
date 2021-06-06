const { Op } = require('sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn(
        'payments',
        'transactionId',
        'gatewayOrderId',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'payments',
        'gatewayPaymentId',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'payments',
        'gatewayRefundId',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.createTable(
        'razorwebhooks',
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          eventType: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          paymentId: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          orderId: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          refundId: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          payload: {
            type: DataTypes.JSONB,
            allowNull: false,
          },
          headers: {
            type: DataTypes.JSONB,
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
        },
        { transaction },
      );
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('razorwebhooks', { transaction });
      await queryInterface.removeColumn('payments', 'gatewayRefundId', { transaction });
      await queryInterface.removeColumn('payments', 'gatewayPaymentId', { transaction });
      await queryInterface.renameColumn(
        'payments',
        'gatewayOrderId',
        'transactionId',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
    });
  },
};
