const { getCryptoRandom } = require('../utils').utilityMethods;

module.exports = (queryInterface, DataTypes) => {
  const listing = queryInterface.define(
    'listing',
    {
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
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  listing.associate = function (models) {
    this.belongsTo(models.city);
    this.hasMany(models.image);
    this.belongsTo(models.user);
    this.hasMany(models.bookmark);
    this.hasMany(models.booking);
  };
  listing.addHook('beforeCreate', (obj) => {
    obj.id = getCryptoRandom();
  });

  return listing;
};
