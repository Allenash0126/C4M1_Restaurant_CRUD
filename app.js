const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'))

app.get('/',(req,res) => {
  res.render('index')
})

app.get('/restaurants',(req,res) => {
  return Restaurant.findAll()
    .then((restaurants) => res.send({ restaurants }))
})

app.listen(port,() => {
  console.log(`The server is runnung on http://localhost:${port}`)
})