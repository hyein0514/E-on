// models/RecommendationDashboard.js

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RecommendationDashboard', {
    dashboard_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recommendation_type: DataTypes.STRING
  }, {
    tableName: 'RecommendationDashboard',
    freezeTableName: true,
    timestamps: false
  });
};


