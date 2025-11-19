const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://wesbaig:${password}@cluster0.iveo728.mongodb.net/phonebook_db`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "Anna",
  number: "040-1234556",
});
