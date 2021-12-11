'use strict';
const {
  Model, DataTypes
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: 'RoomUsers',
        foreignKey: 'roomId',
        otherKey: 'userId'
      });
      this.hasMany(models.Message, {
        foreignKey: 'roomId',
      });
    }
  }
  Room.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });

  return Room;
};