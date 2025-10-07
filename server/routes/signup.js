const db = require("./connectdb.js");
const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();

route.post('/register', async (req,res) => {  
  const {username,email,password} = req.body || {};

  if (!username || !email || !password) {
    return res.sendStatus(400).json({error : "missing data"});
  }

  const hashpass = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username,email,password) VALUES (?,?,?)', [username,email,hashpass], (err) => {
    if (err) throw res.sendStatus(500).json({error : "error creating user in db"});

    res.sendStatus(200).json({message: "Sign Up successfully"});
    
  })
});

module.exports = route;
