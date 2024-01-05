//jshint esversion:6
require('dotenv').config()
const express = require ("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(()=>console.log("connected to db"));

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFeilds:['password'],excludeFromEncryption: ['email']});

const User = new mongoose.model("User",userSchema);


app.get("/",function (req,res) {
  res.render("home");
});
app.get("/register",function (req,res) {
  res.render("register");

});
app.get("/login",function (req,res) {
  res.render("login");
});

app.post("/register",function (req,res) {
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save().then(()=>{
    res.render("secrets");
  })
});
app.post("/login",function (req,res) {
  const userName = req.body.username;
  const password =req.body.password;
  User.findOne({email:req.body.username}).then(function(foundUser){
    if (foundUser) {
        if(foundUser.password ===password){
          res.render("secrets");
        }
        else{
          res.send("password was incorrect");
        }
    } else {
       res.send("username not found");
    }

  })
});










app.listen(3000,function () {
  console.log("server is running on port 3000");
})
