const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const port = 3000
// 在按下Button之後，才驗證輸入是否符合規格
const wasValidated = 'was-validated'

const db = require('./models')
const messageHandler = require('./middlewares/message-handler')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(messageHandler)

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword?.trim()
  return Restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
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
      res.render('restaurants', { restaurants: matchedRestaurants, keyword })
    })
})

app.get('/restaurants/new', (req, res) => {
  res.render('new', { wasValidated })
})

// 接住new.hbs送來的新增data，並在DB中create
app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => {
      req.flash('success', '新增成功！')
      res.redirect('/restaurants')
    })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('restaurant', { restaurant }))
})

// 進入編輯頁面，並提取已在DB中的資料，放到既有欄位中
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant, wasValidated }))
})

// 接住edit.hbs送來的更新data，更新DB
app.put('/restaurants/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  return Restaurant.update({ name: body.name, name_en: body.name_en, category: body.category, image: body.image, location: body.location, phone: body.phone, google_map: body.google_map, rating: body.rating, description: body.description }, { where: { id } })
    .then(() => {
      req.flash('success', '更新成功！')
      res.redirect(`/restaurants/${id}`)
    })
})

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功！')
      res.redirect('/restaurants')
    })
})

app.listen(port, () => {
  console.log(`The server is runnung on http://localhost:${port}`)
})
