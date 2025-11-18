const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(express.static("dist"));

app.use(express.json()); //required for body
app.use(morgan("tiny"));
// app.use(cors());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "Wesley Snipes",
    number: "45-65-1253658",
  },
];

// const generateId = () => {
//   const ids = persons.map((p) => Number(p.id));
//   const maxId = persons.length > 0 ? Math.max(...ids) : 0;
//   return maxId + 1;
// };

const randomID = () => {
  const min = 1;
  const max = 100000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// delete singular ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// Find singular id
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/morgan", (request, response) => {
  response.send("Morgan test successful");
});

// ADD someone
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const personNames = persons.map((person) => person.name);

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number missing" });
  }
  if (personNames.includes(body.name)) {
    return response.status(409).json({ error: "Name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(randomID()),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  const ids = persons.length;

  const date = require("date-and-time");
  const now = new Date();
  const formatted = date.format(now, "DD/MM/YYYY HH:MM:SS");

  console.log(formatted);
  response.send(`Phonebook has info for ${ids} people ${formatted} GMT`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
