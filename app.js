// initializing or import different packages 
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const Blog = require("./models/blog");
const cookieParser = require("cookie-parser"); 
const { reqAuth, checkUser } = require('./Midlewares/midleware');
const jwt = require("jsonwebtoken");
require("dotenv").config();


const app = express();

// Middlewares 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());


app.set("view engine", "ejs");

// database connection 
mongoose.connect("mongodb+srv://asad58057:asad1214@cluster0.3rjyv82.mongodb.net/E-Learning", {useNewUrlParser: true, useUnifiedTopology: true,})
.then((result)=> {
    console.log("connect to database....")
    app.listen(8085)})
.catch(err=>console.log(err))

// user view 
app.get('*', checkUser);

// home page 
app.get("/", (req,res)=>{
    res.render("Home", {title:"Home Page"})
})

// check authentication continously..
app.get("/courses", reqAuth, (req,res)=>{
    res.render("courses", {title:"courses Page"})});

// importing all routers from the route folder     
app.use(authRoutes);    
































