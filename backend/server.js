const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const {spawn} = require("child_process");
const Transaction =
require("./models/Transaction");
const transactionRoutes =
require("./routes/transactionRoutes");


const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(
  "mongodb://kritikarkrish_db_user:QmaswZ9ZAYfMc6I6@ac-fynlbtu-shard-00-00.cotsvvu.mongodb.net:27017,ac-fynlbtu-shard-00-01.cotsvvu.mongodb.net:27017,ac-fynlbtu-shard-00-02.cotsvvu.mongodb.net:27017/?ssl=true&replicaSet=atlas-5om1mt-shard-0&authSource=admin&appName=Cluster0&retryWrites=true&w=majority",
{
    serverSelectionTimeoutMS: 30000
}
)

.then(() => {

  console.log("MongoDB Connected");

})

.catch((error) => {

  console.log(error);

});

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {

  res.send(
    "SmartShield AI Backend Running"
  );

});

app.use("/", transactionRoutes);
/* =========================
   SERVER
========================= */

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});