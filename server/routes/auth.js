const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();


function authenticateToken (req,res,next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); //unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
   if (err) return res.sendStatus(403); //forbidden
   req.user = user;
  })
    
}

module.exports = authenticateToken;
