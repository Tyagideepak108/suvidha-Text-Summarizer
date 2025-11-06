'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Summary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Summary.belongsTo(models.User, { foreignKey: 'userId' });
      Summary.belongsTo(models.Article, { foreignKey: 'articleId' });
    }
  }
  Summary.init({
    summary_text: DataTypes.TEXT,
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Summary',
  });
  return Summary;
};