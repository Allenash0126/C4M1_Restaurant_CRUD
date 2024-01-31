const express = require('express')
const router = express.Router()
const passport = require('passport')

const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

// (1) 這裡把restaurants.js當作是middleware來引用
// (2) 前面的'/restaurants'，表示未來在restaurants.js中的預設新路徑 都是restaurants開頭，避免兩個路徑模組都有/根目錄 衝突
// (3) 記得去restaurants.js，把路徑/restaurants刪掉，避免路徑變成/restaurants/restaurants...
router.use('/restaurants', authHandler, restaurants)
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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }
    return res.redirect('/login')
  })
})

module.exports = router
