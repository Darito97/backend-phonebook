const express = require('express')
const app = express()

app.use(express.json())

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


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`)
})