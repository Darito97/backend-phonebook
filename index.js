const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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
  res.status(200).json({ numberOfPhoneNumbers: phoneBook.length })
})
app.get('/api/phonenumbers', (req, res) => {
  res.status(200).json(phoneBook)
})

app.get('/api/phonenumbers/:id', (req, res) => {
  let id = Number(req.params.id)
  const person = phoneBook.find(number => number.id === id)
  if (person) {
    res.status(200).json(person)
  }
  else {
    res.status(404).json({ error: "not_found" })
  }
})
app.post('/api/phonenumbers', (req, res) => {
  const { name, phoneNumber } = req.body
  if (name && phoneNumber) {
    let id = Math.max(...phoneBook.map(number => number.id)) + 1
    let newNumber = { id, name, phoneNumber }
    phoneBook.push(newNumber)
    res.status(201).json({ success: true })

  }
  else {
    res.status(404).json({ error: "content_not_found" })
  }
})
app.delete('/api/phonenumbers/:id', (req, res) => {
  let id = Number(req.params.id)
  if (phoneBook.find(number => number.id === id)) {
    phoneBook = phoneBook.filter(number => number.id !== id)
    res.status(200).json({ removed: true })
  }
  else {
    res.status(404).json({ error: 'number_not_found' })
  }
})
app.put('/api/phonenumbers/:id', (req, res) => {
  let id = Number(req.params.id)
  const { name, phoneNumber } = req.body
  if (phoneBook.find(number => number.id === id)) {
    let index = phoneBook.findIndex(number => number.id === id)
    phoneBook[index] = {
      id,
      name,
      phoneNumber
    }
    res.status(200).json({
      changed: true
    })
  }
  else {
    res.status(404).json({ error: 'not_found' })
  }
}
)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`)
})