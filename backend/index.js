import express from "express";
import http from "http";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import compress from "compression";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { stockAPIs } from "./controllers/stock.controller.js";
import { forBase64 } from "./controllers/base64.controller.js";
import { forQueryString } from "./controllers/query.controller.js";
import { stockSocket, stockSocketRedis } from "./services/stock.socket.js";
import { everyOneMinUpdateNineStocksRedis } from "./services/stock.automation.js";

import dotenv from "dotenv";
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

import redis from "redis";
// import pkg from 'redis';
// const {createClient} = pkg;

export const client = redis.createClient(`redis://${process.env.REDIS_DB}`);

client.on("error", function (error) {
  console.error(error);
});

client.set("key", "value", redis.print);
client.get("key", redis.print);

// Mongo DB connection
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/stock");
mongoose.connect(`mongodb://${process.env.MONGO_DB}/stock`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let port = process.env.BACKEND_PORT;

// Express
const app = express();
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
const buildDir = path.join(__dirname, ".", "public");

app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(buildDir, "index.html"));
});

// Controllers
stockAPIs(app);
forBase64(app);
forQueryString(app);

// Use http
const httpserver = http.createServer(app);

// // Service End

// // Socket for stock
// stockSocketRedis(httpserver);

// // automation updating every one min
// setInterval(function () {
//   console.log("APIs call to KRX every one min");
//   everyOneMinUpdateNineStocksRedis();
// }, process.env.NINE_STOCK_TIME);

httpserver.listen(port, function () {
  console.log(`Lunch app is listening on port !${port}`);
});
