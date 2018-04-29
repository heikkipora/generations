const _ = require('lodash')
const browserify = require('browserify-middleware')
const compression = require('compression')
const express = require('express')
const lessMiddleware = require('less-middleware')

const app = express()
app.disable('x-powered-by')

app.use(compression())
app.use(lessMiddleware(`${__dirname}/../public`))
app.use(express.static('public'))
app.get('/js/client.js', browserify(__dirname + '/client/index.js'))

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${server.address().port}`)
})
