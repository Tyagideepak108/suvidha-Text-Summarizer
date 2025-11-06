'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsTo(models.User, { foreignKey: 'userId' });
      Article.hasMany(models.Summary, { foreignKey: 'articleId' });
    }
  }
  Article.init({
    original_text: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};