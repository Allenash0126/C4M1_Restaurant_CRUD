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

app.get('/',(req,res) => {
  const keyword = req.query.keyword?.trim()
  const matchedRestaurants = keyword ? restaurants.filter(rt => 
    Object.values(rt).some((property) => {
      if (typeof property === 'string') {
      return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })    
  ) : restaurants
  res.render('index',{ restaurants: matchedRestaurants, keyword })
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

app.listen(port,() => {
  console.log(`The server is runnung on http://localhost:${port}`)
})