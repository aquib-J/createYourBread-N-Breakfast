const { Op } = require('sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'reviews',
        'listingId',
        {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'bookings',
        'status',
        {
          type: DataTypes.STRING,
          defaultValue: 'BOOKED',
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'listings',
        'status',
        {
          type: DataTypes.STRING,
          defaultValue: 'AVAILABLE',
        },
        { transaction },
      );
      await queryInterface.removeColumn('reviews', 'bookingId', { transaction });
      await queryInterface.removeColumn('reviews', 'byHost', { transaction });

      await queryInterface.addIndex(
        'bookmarks',
        ['listingId', 'userId'],
        {
          unique: true,
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        },
        { transaction },
      );
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('reviews', 'listingId', { transaction });
      await queryInterface.removeColumn('bookings', 'status', { transaction });
      await queryInterface.removeColumn('listings', 'status', { transaction });
      await queryInterface.addColumn(
        'reviews',
        'bookingId',
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'reviews',
        'byHost',
        {
          type: DataTypes.BOOLEAN,
        },
        { transaction },
      );
    });
    await queryInterface.removeIndex('bookmarks', ['listingId', 'userId'], { transaction });
  },
};
