import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";

import compress from "compression";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { stockAPIs } from "./controllers/stock.controller.js";
import { forBase64 } from "./controllers/base64.controller.js";

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
const buildDir = path.join(__dirname, ".", "public");

// const router = express.Router();
// controllers
app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(buildDir, "index.html"));
});

stockAPIs(app);
forBase64(app);

const server = http.createServer(app);

server.listen(port, function () {
  console.log(`Lunch app is listening on port !${port}`); // eslint-disable-line no-console
});


// import * as socket from "socket.io";
// const io = new socket.Server(server, {
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       "Access-Control-Allow-Headers": "*",
//       "Access-Control-Allow-Origin": "*", //or the specific origin you want to give access to,
//       "Access-Control-Allow-Credentials": true,
//     };
//     res.writeHead(200, headers);
//     res.end();
//   },
// });

// io.on("connection", (socket) => {
//   // either with send()
//   socket.send("Hello!");

//   // or with emit() and custom event names
//   socket.emit("greetings", "Hey!", { ms: "jane" }, Buffer.from([4, 3, 3, 1]));

//   // handle the event sent with socket.send()
//   socket.on("message", (data) => {
//     console.log(data);
//   });

//   // handle the event sent with socket.emit()
//   socket.on("salutations", (elem1, elem2, elem3) => {
//     console.log(elem1, elem2, elem3);
//   });
// });
