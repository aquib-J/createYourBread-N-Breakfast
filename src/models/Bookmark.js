module.exports = (queryInterface, DataTypes) => {
  const bookmark = queryInterface.define(
    'bookmark',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      listingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
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

  bookmark.associate = function (models) {
    this.belongsTo(models.listing);
    this.belongsTo(models.user);
  };

  return bookmark;
};
