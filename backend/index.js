import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import compress from "compression";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { stockAPIs } from "./controllers/stock.controller.js";

dotenv.config();

const app = express();

let port = 3000;
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/stock");
mongoose.connect(`mongodb://${process.env.MONGO_DB}/stock`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(compress());
app.use(bodyParser.json());

// ALL IP의 Request를 수락함
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// please check
const buildDir = path.join(__dirname, "..", "public");

// const router = express.Router();
// controllers
app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(buildDir, "index.html"));
});

stockAPIs(app);

app.listen(port, function () {
  console.log(`Lunch app is listening on port !${port}`); // eslint-disable-line no-console
});
