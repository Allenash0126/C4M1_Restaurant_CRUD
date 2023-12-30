const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// const restaurants = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res) => {

})

app.get('/restaurants',(req,res) => {
  const keyword = req.query.keyword?.trim()
  return Restaurant.findAll({
    attributes:['id','name','name_en','category','image','location','phone','google_map','rating','description'],
    raw: true
  })
    .then((restaurants) => {
      const matchedRestaurants = keyword ? restaurants.filter(rt => 
        Object.values(rt).some((property) => {
          if (typeof property === 'string') {
          return property.toLowerCase().includes(keyword.toLowerCase())
          }
          return false
        })    
      ) : restaurants
      res.render('restaurants',{ restaurants: matchedRestaurants, keyword })})
})

app.get('/restaurants/new',(req,res) => {
  res.render('new')
})

app.post('/restaurants', (req,res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating,description })
  .then(() => res.redirect('/restaurants'))
})

app.listen(port,() => {
  console.log(`The server is runnung on http://localhost:${port}`)
})