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
      Restaurant.belongsTo(models.User)
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
    description: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}
