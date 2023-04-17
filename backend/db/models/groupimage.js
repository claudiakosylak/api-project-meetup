'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupImage.belongsTo(models.Group)
    }
  }
  GroupImage.init({
    groupId: DataTypes.INTEGER,
    url: DataTypes.VARCHAR,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};