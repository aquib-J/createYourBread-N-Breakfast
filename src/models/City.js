module.exports = (queryInterface, DataTypes) => {
  const city = queryInterface.define(
    'city',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      cityName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stateId: {
        type: DataTypes.INTEGER,
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

  city.associate = function (models) {
    this.hasOne(models.state);
  };

  return city;
};
