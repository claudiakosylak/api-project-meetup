'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, {
        otherKey: "eventId"
      })
    }
  }
  EventImage.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    eventId: DataTypes.INTEGER,
    url: DataTypes.VARCHAR(255),
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
