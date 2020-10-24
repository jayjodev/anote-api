const path = require("path");
const express = require("express");
const compress = require("compression");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

let port = 3000
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/stock");
mongoose.connect(`mongodb://${process.env.MONGO_DB}/stock`, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(compress());
app.use(bodyParser.json());

// ALL IP의 Request를 수락함
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  next();
});

// controllers
require("./controllers/stock.controller")(app);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(buildDir, "index.html"));
});

app.listen(port, function () {
  console.log(`Lunch app is listening on port !${port}`); // eslint-disable-line no-console
});
