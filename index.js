const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

require('dotenv').config()

const PhoneNumber = require('./models/phoneNumber')
const { default: mongoose } = require('mongoose')
const URL = process.env.DB_URL

mongoose.connect(URL).then(res => console.log('connected to mongoDB')).catch(err => console.log('Error to connected mongoDB: ', err))


morgan.token('body', function (req) {
  let { name, phoneNumber } = req.body
  if (name && phoneNumber) {
    return `{ name: ${name}, phoneNumber : ${phoneNumber} }`
  }
  return ''
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phoneBook = [
  {
    id: 1,
    name: "example",
    phoneNumber: "0000000000"
  }
]
app.get('/info', (req, res) => {
  PhoneNumber.countDocuments({}).then(count => {
    res.status(200).json({ numberOfPhoneNumbers: count })
  }).catch(err => {
    console.log(err)
    res.status(500).json({ error: err })
  })
})

app.get('/api/phonenumbers', (req, res) => {
  PhoneNumber.find({}).then(response => {
    res.status(200).json(response)
  }).catch(err => res.status(404).json({ error: err }))
})

app.get('/api/phonenumbers/:id', (req, res) => {
  let id = Number(req.params.id)
  PhoneNumber.findOne({ id }).then(response => {
    if (response) {
      res.status(200).json(response)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  }).catch(err => res.status(404).json({ error: err }))
})

app.post('/api/phonenumbers', (req, res) => {
  const { name, phoneNumber } = req.body
  if (name && phoneNumber) {
    const phone = new PhoneNumber({
      name: name,
      phoneNumber: phoneNumber
    })
    phone.save().then(phone => {
      console.log('saved')
      res.status(201).json({ success: true })
    }).catch(err => {
      console.log(err)
      res.status(400).json({ error: err })
    })
  }
  else {
    res.status(400).json({ error: "content_not_found" })
  }
})

app.delete('/api/phonenumbers/:id', (req, res) => {
  let id = req.params.id
  PhoneNumber.findByIdAndDelete(id).then(response => {
    if (response) {
      res.status(200).json({ success: true })
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  }).catch(err => res.status(404).json({ error: err }))
})

app.put('/api/phonenumbers/:id', (req, res) => {
  let id = req.params.id
  const { name, phoneNumber } = req.body
  PhoneNumber.findByIdAndUpdate(id, { name, phoneNumber }).then(response => {
    if (response) {
      res.status(200).json({ success: true })
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  }).catch(err => res.status(404).json({ error: err }))
}
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`)
})