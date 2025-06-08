'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ① Challenge 테이블에 created_at/updated_at 컬럼 추가
    await queryInterface.addColumn('Challenge', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('Challenge', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    // ② 롤백 시 컬럼 제거
    await queryInterface.removeColumn('Challenge', 'created_at');
    await queryInterface.removeColumn('Challenge', 'updated_at');
  }
};
