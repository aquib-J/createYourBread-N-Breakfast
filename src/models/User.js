const { getCryptoRandom } = require('../utils').utilityMethods;

module.exports = (queryInterface, DataTypes) => {
  const user = queryInterface.define(
    'user',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      dob: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      profilePictureUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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

  user.associate = function (models) {
    this.hasMany(models.booking);
    this.hasMany(models.listing);
    this.hasMany(models.bookmark);
    this.hasMany(models.review);
  };
  user.addHook('beforeCreate', (obj) => {
    obj.id = getCryptoRandom();
  });
  user.addHook('afterCreate', (obj) => {
    delete obj.dataValues.password;
  });

  return user;
};
