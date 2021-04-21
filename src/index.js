const express = require('express')
const UserRouter = require('./routers/UserRouter')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const handlebars  = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const port = 3030
mongoose.connect('mongodb+srv://snake1308:snake1308@cluster0.uiblj.mongodb.net/tinder_db', {useNewUrlParser: true, useUnifiedTopology: true})

app.use(express.static(path.join(__dirname, 'public')))
//HTTP LOGGER
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
//TEMPLATE ENGINE
app.engine('hbs', handlebars({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resource/views'))

app.use('/', UserRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})