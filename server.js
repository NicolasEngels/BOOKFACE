// Set up required packages and dependencies
import dotenv from 'dotenv';
dotenv.config()
import express from"express";
import mongoose from"mongoose";
import bodyParser from"body-parser";
import Users from './users.js';
import bcrypt from 'bcrypt';
import flash from 'express-flash';
import session from "express-session";
import passport from 'passport';

import initializePassport from "./passport-config.js";
initializePassport(
  passport,
  (email) => Users.find((user) => user.email === email),
  (id) => Users.find((user) => user.id === id)
);


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
app.use(express.urlencoded({extended:false}))
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

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

app.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  let errors = [];

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!name || !email || !password) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "password atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {errors});
  }else{
    Users.findOne({email : email}).exec((err,user)=>{
    console.log(user);   
    if(user) {
        errors.push({msg: 'email already registered'});
        res.render("register", { errors });  
    }else{
      const newUser = new Users({
          name : name,
          email : email,
          password : hashedPassword
      });
      newUser.save();
      res.redirect('/login');
    }
  })} 
});

app.get('/login', (req, res)=>{
  res.render('login');
})

app.post("/login", function(req, res, next){passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
})(req, res, next)})

// Start the server on port 3000
app.listen(3000, () => {
  console.log("MERN app listening on port 3000!");
});
