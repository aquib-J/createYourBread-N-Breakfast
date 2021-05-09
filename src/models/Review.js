module.exports = (queryInterface, DataTypes) => {
  const review = queryInterface.define(
    'review',
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      rating: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      byHost: {
        type: DataTypes.BOOLEAN,
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
  );//TODO: add listing Id column here and change the association between review and booking to review & listing

  review.associate = function (models) {
    this.belongsTo(models.booking);
    this.belongsTo(models.user);
  };

  return review;
};
