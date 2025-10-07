const express = require("express");
const env = require("dotenv")
const jwt = require("jsonwebtoken");
const cors = require("cors");

const db = require("./routes/connectdb.js")
const login = require("./routes/login.js");
const signup = require("./routes/signup.js");
const stream = require("./routes/stream.js");
const readDirs = require("./routes/upload.js")


const port = "5000";
env.config();
const app = express();
app.use(express.json());


db.query('select * from users', (err,results) => {
  if (err) throw err;
  console.log(results[0]);
})


app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());


app.use("/api", login);
app.use("/api", signup);
app.use("/stream", stream);
app.use("/show", readDirs);

app.get("/", (req,res) => {
  res.json({ message:"yes u have arrived on the server..."});
  console.log("server was accessed !!!")
})



app.listen(port, () => {
  console.log(`server running on port ${port}...`);
})
