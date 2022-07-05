const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path:"./.env"});
const {TOKEN_KEY} = process.env;
console.log(TOKEN_KEY);
router.use(express.json());
const auth = require("../middlewares/auth");
const UserModel =require('../models/users');



//registration .........................................................................................



router.post("/register", async (req , res) => {
   try{
            const {firstName , lastName , email , password} = req.body;

            if(!(firstName && lastName && email && password)) {
               res.status(400).send("all input is invalid");
            }

         const oldUser = await UserModel.findOne({ email });

         if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
         }

         encryptedPassword = await bcrypt.hash(password, 10);


         const user = await UserModel.create({
            firstName,
            lastName,
            email: email.toLowerCase(), 
            password: encryptedPassword,
         });
         
         const token = jwt.sign(
            { user_id: user._id, email },
             TOKEN_KEY,
            {
            expiresIn: "2h",
            }
         );

         user.token = token;

         console.log("register is done");
         res.status(201).json(user);
   
   }

   catch(err) {

         console.log(err);

   }
});

//login ....................................................................................................


router.post("/login", async (req, res) => {
   try {
     const { email, password } = req.body;
     if (!(email && password)) {
       res.status(400).send("All input is required");
     }
     const user = await UserModel.findOne({ email });
     if (user && (await bcrypt.compare(password, user.password))) {
       const token = jwt.sign(
         { user_id: user._id, email },
         TOKEN_KEY,
         {
           expiresIn: "2h",
         }
       );
       user.token = token;
       res.status(200).json(user);
       console.log("login is done");
     }
     res.status(400).send("Invalid Credentials");
   } 
   
   catch (err) {
     console.log(err);
   }

 });

//middleware .................................................................................................................


router.post("/welcome", auth, (req, res) => {
   res.status(200).send("Welcome to home page ");
 });
 


// crud .............................................................................................

router.post("/", async(req, res) =>{
   const userBody = req.body
   const user = new UserModel(userBody)
   const savedUser = await user.save()
      return res.json(savedUser)
})



router.get("/", async(req, res) =>{
   try{
      let allusers = await UserModel.find({})
      res.json(allusers);
   }
   catch{
      res.json({code:"DB_Error"})

   }
})

router.get("/:id", async(req, res) =>{
   const id = req.params.id
   try{
    let oneuser= await UserModel.findById(id)
    res.json(oneuser);

   }
   catch{
      res.json({code:"DB_Error"})
   }
})

router.put("/:id",async (req, res) =>{
   const {id}= req.params;
   let item =req.body
   try{
      let userupdated= await UserModel.findOneAndUpdate(id,item,{returnOriginal:false});
      res.json(userupdated);
   }
   catch{
      res.json({code:"DB_Error"})
   }
})


router.delete("/:id",async(req, res) =>{
   const {id}= req.params;
   let item =req.body
   try{
      let userdelete= await UserModel.findOneAndDelete(id);
      res.json(userdelete);
   }
   catch{
      res.json({code:"DB_Error"})
   }
})


module.exports= router