const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface
      .createTable('users', {
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
      })
      .then(async () => {
        await queryInterface.addIndex('users', ['emailId'], {
          unique: true,
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        });
      }),

  down: (queryInterface, DataTypes) => queryInterface.dropTable('users'),
};
