import { Model } from 'sequelize';

module.exports = (sequelize, dataTypes) => {
  class User extends Model {};
  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: dataTypes.STRING,
        allowNull: true
      },
      externalId: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: dataTypes.STRING,
        allowNull: true
      },
      language: {
        type: dataTypes.STRING,
        allowNull: true
      }
    }, {
      modelName: 'user',
      sequelize,
      indexes: [{ unique: true, fields: ['externalId']}],
      timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models['package'], {
      foreignKey: 'userId',
      as: 'packages'
    });
  }

  return User;
}
