'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: "userId"
      })
      Membership.belongsTo(models.Group, {
        foreignKey: "groupId",
        onDelete: "CASCADE"
      })
    }
  }
  Membership.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    groupId: {
      type: DataTypes.INTEGER,
      onDelete: "cascade"
    },
    status: DataTypes.ENUM("co-host", "member", "pending")
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
