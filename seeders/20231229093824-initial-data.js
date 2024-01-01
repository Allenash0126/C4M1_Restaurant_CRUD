'use strict';

// 由原本手動鍵入種子資料，改為自動載入整筆json
const initialData = require('/Users/allenash/Documents/AlphaCamp/HW/C4/M1_Restaurant_CRUD/public/jsons/restaurant.json').results
    initialData.forEach((data) => {
      // 因為autoIncrement 會自動產生id，所以這裡先移除id 不然會跳錯
      delete data.id
      data.createdAt = new Date()
      data.updatedAt = new Date()
    })

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Restaurants', initialData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null)
  }
};
