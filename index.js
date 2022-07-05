const express = require("express");
const app = express();
const mongoose= require("mongoose");
app.use(express.json());
const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://127.0.0.1:27017/blogging',(err)=>{
    if(!err) {
        console.log('DB connection established');
    }
    else{
        console.log(err);
    }
})




const userRouter = require("./routes/users.js");
app.use('/users', userRouter);


app.listen(PORT, (err) => {
    if (!err) return console.log(`server starts at port ${PORT}`);
    console.log(err);
})

