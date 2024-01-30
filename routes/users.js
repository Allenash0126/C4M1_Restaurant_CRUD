const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

router.post('/', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  if (password !== confirmPassword) {
    req.flash('fail', '輸入兩次不同的密碼 :(')
    return res.redirect('register')
  }

  User.findAll({
    attributes: ['id', 'name', 'email', 'password'],
    raw: true
  })
    .then((users) => {
      const isEmailExists = users.find((user) => user.email === email)
      if (isEmailExists) {
        req.flash('fail', '已註冊，請直接登入！')
        return res.redirect('login')
      }

      return bcrypt.hash(password, 10)
        .then((hash) => {
          return User.create({ name, email, password: hash })
            .then(() => {
              req.flash('success', '註冊成功！')
              res.redirect('login')
            })
            .catch((error) => {
              req.errorMessage = '註冊失敗:('
              next(error)
            })
        })
    })
})

module.exports = router
