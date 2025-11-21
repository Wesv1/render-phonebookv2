require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require('mongoose')

const app = express()
app.use(express.static("dist"))
app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

// MONGOOSE MODEL
const Person = require('./phonebook_backend/models/contacts') 

// MONGODB 
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err.message))




// GET ALL PERSONS
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
})

// GET SINGLE PERSON
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

// CREATE NEW PERSON
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// DELETE PERSON
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// INFO PAGE
app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const now = new Date()
      res.send(
        `<p>Phonebook has info for ${count} people</p><p>${now}</p>`
      )
    })
    .catch(error => next(error))
})

// ERROR HANDLER
app.use((error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
