'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Event, {
        foreignKey: "groupId"
      })
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        as: "Organizer",
        onDelete: "CASCADE"
      })
      Group.hasMany(models.Venue, {
        foreignKey: "groupId"
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId"
      })
      Group.hasMany(models.Membership, {
        foreignKey: "groupId"
      })
    }
  }
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organizerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.TEXT,
    type: DataTypes.ENUM("Online", "In Person"),
    private: DataTypes.BOOLEAN,
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
