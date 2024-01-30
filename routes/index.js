const express = require('express')
const router = express.Router()
const restaurants = require('./restaurants')
const users = require('./users')

// (1) 這裡把restaurants.js當作是middleware來引用
// (2) 前面的'/restaurants'，表示未來在restaurants.js中的預設新路徑 都是restaurants開頭，避免兩個路徑模組都有/根目錄 衝突
// (3) 記得去restaurants.js，把路徑/restaurants刪掉，避免路徑變成/restaurants/restaurants...
router.use('/restaurants', restaurants)
router.use('/users', users)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  const loginInfo = req.body
  console.log(loginInfo.email, loginInfo.password)
})

router.get('/logout', (req, res) => {
  res.send('You have logged out. Bye~')
})

module.exports = router
