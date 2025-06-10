module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RecommendationItem', {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    month: DataTypes.INTEGER,
    target_grade: DataTypes.INTEGER,
    school_type: DataTypes.STRING,
    dashboard_id: DataTypes.INTEGER
  }, {
    tableName: 'RecommendationItem', // 실제 테이블 이름 명시 (선택 사항)
    freezeTableName: true // 자동 복수화 방지
  });
};
