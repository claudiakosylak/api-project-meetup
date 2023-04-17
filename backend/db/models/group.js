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
      Group.belongsTo(models.User)
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
    organizerId: DataTypes.INTEGER,
    name: DataTypes.VARCHAR,
    about: DataTypes.TEXT,
    type: DataTypes.ENUM("Online", "In Person"),
    private: DataTypes.BOOLEAN,
    city: DataTypes.VARCHAR,
    state: DataTypes.VARCHAR
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
