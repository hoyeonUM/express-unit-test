const express = require('express')
const app = express()
app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({ extended: false }))
const messenger = require('./modules/messenger')

app.post('/sms/send',async (req, res, next) => {
  messenger.send(req.body.content)
  res.status(200)
  res.json({
    'code'   : 200,
    'message': 'success'
  })
})

app.get('/error',async (req, res, next) => {
  next(new Error('error'))
})


app.use((req, res) => {
  res.status(404)
  res.json({
    'code'   : 404,
    'message': 'api not found'
  })
})
app.use(function(err, req, res, next) {
  res.status(500)
  res.json({
    'code'   : 500,
    'message': 'Internal Server Error'
  })
})
module.exports = app
