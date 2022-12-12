// Set up required packages and dependencies
import express from"express";
import mongoose from"mongoose";
import bodyParser from"body-parser";
import Users from './users.js';

// Set up MongoDB connection
mongoose.set("strictQuery", true);

mongoose.connect(
  "mongodb+srv://NicolasEngels:Sarcelles34@cluster0.md4ws81.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a new Express application
const app = express();

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Use body-parser to parse form data sent via HTTP POST
app.use(bodyParser.urlencoded({ extended: true }));

// Use body-parser to parse JSON data sent via HTTP POST
app.use(bodyParser.json());

// Set up a route to serve the homepage
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
    let {name, email, password} = req.body;
    console.log(req.body)

    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    newUser.save();
});

app.get("/test", (req, res) => {
  res.json(Users.find({}));
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("MERN app listening on port 3000!");
});
