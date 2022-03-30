const mongoose = require('mongoose')
require('dotenv').config()

const URL = process.env.DB_URL

mongoose.connect(URL).then(res => console.log('connected')).catch(err => console.log(err))

const Schema = mongoose.Schema;
const phoneNumberSchema = Schema({
  name: String,
  phoneNumber: Number
})
phoneNumberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema);
