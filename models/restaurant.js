'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Restaurant.init({
    name: DataTypes.TEXT,
    name_en: DataTypes.STRING,
    category: DataTypes.TEXT,
    image: DataTypes.STRING,
    location: DataTypes.TEXT,
    phone: DataTypes.STRING,
    google_map: DataTypes.STRING,
    rating: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}
