const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const User = require('./models/Student')
const Teacher= require('./models/Teacher');
const bcrypt = require("bcrypt");
const Concern=require('./models/Conserns')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const cookieParser=require("cookie-parser");



const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true, //access-control-allow-credentials:tru
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); //setting middleware for cors error

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret='iworirjwkngkeajngoiut';

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL);


app.get("/test", (req, res) => {
  res.send("hello node server");
});

//---------------------student registration

app.post("/register", async (req, res) => {
  // mongoose.connect(process.env.MONGO_URL);
  const { name, email, password,register,year,branch,student } = req.body;
  console.log(req.body);
  
  if(student){
    try {
      const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
        register,
        year,
        branch,
        student //encrepting passward using hashsync
      });
      res.json(userDoc);
  
    } catch (e) {
      res.status(422).json(e);
    }
  }
  else{
    console.log("Teacher here")
    try {
      const userDoc = await Teacher.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
        staffid,
        year,
        branch,
        student //encrepting passward using hashsync
      });
      res.json(userDoc);
  
    } catch (e) {
      res.status(422).json(e);
    }
  }
});

// ------------------------------------------------->registraction for teachers
app.post("/registersir", async (req, res) => {
  // mongoose.connect(process.env.MONGO_URL);
  const { name, email, password,register,year,ccourse} = req.body;
  console.log("name is ",name);
 
  try {
    const userDoc = await Teacher.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
      register,
      year,
      ccourse, //encrepting passward using hashsync
    });
    res.json(userDoc);
 
  } catch (e) {
    res.status(422).json(e);
  }
});

//code for log out ---------------->
app.post('/logout',(req,res)=>{
  res.cookie('type','').json(true);
})
 


app.post("/concern", async (req, res) => {
  // mongoose.connect(process.env.MONGO_URL);
  const {name,email,subject,desc,type,smail,status} = req.body;
  // console.log("name is ",name);
  console.log(name,subject,email,desc,type,smail,status);

  try {
    const userDoc = await Concern.create({
      tname:name,
      temail:email,
      subject:subject,
      desc:desc ,
      ptype:type, //encrepting passward using hashsync
      uemail:smail,
      sstatus:"pending"
    });
    
    res.json(userDoc);

  } catch (e) {
    res.status(422).json(e);
  }
});
  

app.get('/profile', (req, res) => {

  const {token}=req.cookies;
  console.log(token); // should print cookies sent by the client
    if(token)
      {
        jwt.verify(token,jwtSecret,{},async (err,user)=>{
           if(err) throw err;
           const userDoc=await User.findById(user.id);
           res.json(userDoc);
        });
      }
      else
      {
         res.json(null);
      }
  
  // res.send(token);
});

app.get('/userprofile', (req, res) => {
  
    const {token}=req.cookies;
    console.log(token); // should print cookies sent by the client
      if(token)
        {
          jwt.verify(token,jwtSecret,{},async (err,user)=>{
            if(err) throw err;
            const userDoc=await User.findById(user.id);
            res.json(userDoc);
          });
        }
        else
        {
          res.json(null);
        }
    // res.send(token);
});

app.post('/userconcerns', async (req, res) => {
  
  const {token}=req.cookies;
  const {email}=req.body;

  // console.log(token); // should print cookies sent by the client
    if(token)
      {
        jwt.verify(token,jwtSecret,{},async (err,user)=>{
          if(err) throw err;
          const userDoc=await Concern.find({temail:email});
          res.json(userDoc);
        });
      }
      else
      {
        res.json(null);
      }
  // res.send(token);
});

app.post('/teacherinbox', (req, res) => {
  const{email}=req.body;
  const {token}=req.cookies;
  console.log(token); // should print cookies sent by the client
    if(token)
      {
        jwt.verify(token,jwtSecret,{},async (err,user)=>{
          if(err) throw err;
          const userDoc=await Concern.find({temail:email});
          res.json(userDoc);
          console.log("inbox info of teacher is",userDoc);
        });
      }
      else
      {
        res.json(null);
      }
 
  // res.send(token);
});

app.get('/myapplications', (req, res) => {
  
  const {token}=req.cookies;
  console.log(token); // should print cookies sent by the client
    if(token)
      {
        jwt.verify(token,jwtSecret,{},async (err,user)=>{
          if(err) throw err;
          const userDoc=await User.findById(user.id);
          res.json(userDoc);
        });
      }
      else
      {
        res.json(null);
      }
  // res.send(token);
});

app.post('/application', (req, res) => {
  const{email}=req.body;
  const {token}=req.cookies;
  console.log(token); // should print cookies sent by the client
    if(token)
      {
        jwt.verify(token,jwtSecret,{},async (err,user)=>{
          if(err) throw err;
          const userDoc=await Concern.find({uemail:user.email});
          console.log(userDoc);
          res.json(userDoc);
        });
      }
      else
      {
        res.json(null);
      }

  // res.send(token);
});


app.post("/login",async (req,res)=>{
  console.log("Why failed?");
  const{lname,lpass}=req.body;
  const resultDoc= await User.findOne({email:lname});
  if(resultDoc)
  {
    const passok=bcrypt.compareSync(lpass,resultDoc.password);
    if(passok)
    {
      jwt.sign({email:resultDoc.email,
        id:resultDoc._id,
        name:resultDoc.name
    },  jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token',token).json(resultDoc);
      })
    }
    else
    {
      res.status(422).json("unfortunitely notfound");
    }
  }
  else
  {
    res.json("not found");
  }

})

app.listen(5000, () => {
  console.log("listening port from 5000");
});