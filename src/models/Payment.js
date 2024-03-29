module.exports = (queryInterface, DataTypes) => {
  const payment = queryInterface.define(
    'payment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gatewayOrderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gatewayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gatewayRefundId: {
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
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  payment.associate = function (models) {
    this.hasOne(models.booking);
    this.belongsTo(models.booking);

  };

  return payment;
};
