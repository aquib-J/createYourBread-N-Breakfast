module.exports = (queryInterface, DataTypes) => {
  const country = queryInterface.define(
    'coountry',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      countryName: {
        type: DataTypes.STRING,
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
    {
      timestamps: true,
      paranoid: true,
    },
  );

  country.associate = function (models) {
    this.hasMany(models.state);
  };

  return country;
};
