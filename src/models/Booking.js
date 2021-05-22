const { getCryptoRandom } = require('../utils').utilityMethods;

module.exports = (queryInterface, DataTypes) => {
  const booking = queryInterface.define(
    'booking',
    {
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
      status: {
        type: DataTypes.ENUM,
        values: ['BOOKED', 'CANCELLED'],
        defaultValue: 'BOOKED',
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  booking.associate = function (models) {
    this.belongsTo(models.user);
    this.belongsTo(models.listing);
    this.hasOne(models.payment);
    this.belongsTo(models.payment);
  };
  booking.addHook('beforeCreate', (obj) => {
    obj.id = getCryptoRandom();
  });

  return booking;
};
