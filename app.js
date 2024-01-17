const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const port = 3000

const messageHandler = require('./middlewares/message-handler')
const router = require('./routes') //不用指定檔案，因為預設就是會第一個找檔名為index者
const errorHandler = require('./middlewares/error-handler')

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

app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`The server is runnung on http://localhost:${port}`)
})
