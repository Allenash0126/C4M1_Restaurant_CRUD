'use strict'

const bcrypt = require('bcryptjs')

// 應作業要求 前三個是user1，後三個是user2
const initialData = require('../public/jsons/restaurant.json').results
initialData.forEach((data) => {
  data.createdAt = new Date()
  data.updatedAt = new Date()
  if (data.id < 4) data.userId = 1
  else data.userId = 2
  // 因為autoIncrement 會自動產生id，所以這裡先移除id 不然會跳錯
  delete data.id
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()
      const hashPwd = await bcrypt.hash('123456768', 10)
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          name: 'user1',
          email: 'user1@example.com',
          password: hashPwd,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          id: 2,
          name: 'user2',
          email: 'user2@example.com',
          password: hashPwd,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction }
      )
      await queryInterface.bulkInsert('Restaurants', initialData, { transaction })
      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
    // 以下原始code
    // await queryInterface.bulkInsert('Restaurants', initialData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}
