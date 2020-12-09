import { Model } from 'sequelize';

module.exports = (sequelize, dataTypes) => {
  class Package extends Model {}

  Package.init(
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      description: {
        type: dataTypes.STRING,
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: dataTypes.STRING,
        allowNull: true
      },
      title: {
        type: dataTypes.STRING,
        allowNull: true
      },
      ttn: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true
      },
      text: {
        type: dataTypes.STRING,
        allowNull: true
      },
      date: {
        type: dataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'package',
      indexes: [{ unique: true, fields: ['ttn'] }],
      timestamps: false,
    }
  );

  Package.beforeUpdate(pck => {
    pck.updatedAt = new Date();
  });

  Package.associate = (models) => {
    Package.belongsTo(models['user'], {
      foreignKey: 'userId'
    });
  }

  return Package;
}