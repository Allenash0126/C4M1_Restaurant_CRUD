const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant

app.get('/',(req,res) => {
  res.send('Server is listening')
})

app.get('/restaurants',(req,res) => {
  return Restaurant.findAll()
    .then((restaurants) => res.send({ restaurants }))
})

app.listen(port,() => {
  console.log(`The server is runnung on http://localhost:${port}`)
})