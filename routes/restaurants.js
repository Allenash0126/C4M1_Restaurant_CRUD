const express = require('express')
const router = express.Router()
const db = require('../models') // 注意路徑變化，這裡改成兩個點，因為要回到上一層
const Restaurant = db.Restaurant

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = 6
  let totalRT = ''
  const keyword = req.query.keyword?.trim()
  const userId = req.user.id

  return Restaurant.findAll({
    attributes: ['id', 'name']
  })
  // 先確認目前的總餐廳數目，將用於定義：按鈕（next）的page最大值
    .then((RT) => {
      totalRT = RT.length
    })
  // 只有符合 userId 的資料，才會被撈出來
    .then(() => {
      return Restaurant.findAll({
        attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
        where: { userId },
        offset: (page - 1) * limit,
        limit,
        raw: true
      })
      // 搜尋功能
        .then((restaurants) => {
          const matchedRestaurants = keyword
            ? restaurants.filter(rt =>
              Object.values(rt).some((property) => {
                if (typeof property === 'string') {
                  return property.toLowerCase().includes(keyword.toLowerCase())
                }
                return false
              })
            )
            : restaurants
          // 此為 pagination
          res.render('restaurants', {
            keyword,
            restaurants: matchedRestaurants,
            pre: page > 1 ? page - 1 : page,
            next: page < Math.ceil((totalRT) / limit) ? page + 1 : page,
            page
          })
        })
    })
})

router.get('/new', (req, res) => {
  const wasValidated = 'was-validated' // 在按下Button之後，才驗證輸入是否符合規格
  res.render('new', { wasValidated })
})

// 接住new.hbs送來的新增data，並在DB中create
router.post('/', (req, res, next) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  const userId = req.user.id

  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => {
      req.flash('success', '新增成功！')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

// 各餐廳的詳細介紹
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('fail', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (restaurant.userId !== userId) {
        req.flash('fail', '權限不足')
        return res.redirect('/restaurants')
      }
      res.render('restaurant', { restaurant })
    })
    .catch((error) => {
      error.errorMessage('資料取得失敗')
      next(error)
    })
})

// 進入編輯頁面，並提取已在DB中的資料，放到既有欄位中
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const wasValidated = 'was-validated' // 在按下Button之後，才驗證輸入是否符合規格
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })

    .then((restaurant) => {
      if (!restaurant) {
        req.flash('fail', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (restaurant.userId !== userId) {
        req.flash('fail', '權限不足')
        return res.redirect('/restaurants')
      }
      res.render('edit', { restaurant, wasValidated })
    })
    .catch((error) => {
      error.errorMessage('資料取得失敗')
      next(error)
    })
})

// 接住edit.hbs送來的更新data，更新DB
router.put('/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.update({ name: body.name, name_en: body.name_en, category: body.category, image: body.image, location: body.location, phone: body.phone, google_map: body.google_map, rating: body.rating, description: body.description, userId }, { where: { id } })
    .then(() => {
      req.flash('success', '更新成功！')
      res.redirect(`/restaurants/${id}`)
    })
    .catch((error) => {
      error.errorMessage = '更新失敗:('
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  // 先確認權限
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('fail', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (restaurant.userId !== userId) {
        req.flash('fail', '權限不足')
        return res.redirect('/restaurants')
      }

      // 有權限 才能刪除
      return Restaurant.destroy({ where: { id } })
        .then(() => {
          req.flash('success', '刪除成功！')
          res.redirect('/restaurants')
        })
        .catch((error) => {
          next(error)
        })
    })

    .catch((error) => {
      error.errorMessage('資料取得失敗')
      next(error)
    })
})

module.exports = router
