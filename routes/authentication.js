const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()
const auth = require("../middlewares/auth");
router.use(express.json());

//middleware

router.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome to home page");
});



module.exports = router;