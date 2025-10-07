const express = require("express");
const db = require("./connectdb.js");
const route = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

route.post("/signin", async (req,res) => {
  const {username,password} = req.body || {};

  if (!username || !password) {
     return res.status(400).json({error: "Missing username or password"});
  }

  db.query('select * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw console.log('error finding user');

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({error: "invalid username or password"});
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is not defined in .env", process.env.JWT_SECRET);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("secret token", process.env.JWT_SECRET);
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET,{
      expiresIn: "1d"
    });
    
    res.json({message: "login successfully", token});
  })
    
})


module.exports = route
