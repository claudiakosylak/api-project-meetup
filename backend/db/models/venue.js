'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, {
        foreignKey: "venueId"
      })
      Venue.belongsTo(models.Group, {
        otherKey: "groupId"
      })
    }
  }
  Venue.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: DataTypes.INTEGER,
    address: DataTypes.VARCHAR,
    city: DataTypes.VARCHAR,
    state: DataTypes.VARCHAR,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
