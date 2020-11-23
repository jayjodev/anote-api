import * as socket from "socket.io";
import { getStockInfo } from "../controllers/stock.api.js";
import Stock from "../models/Stock.js";
import dotenv from "dotenv";
import { client } from "../index.js";
dotenv.config();

export function stockSocketRedis(httpserver) {
  const io = new socket.Server(httpserver, {
    path: "/stock",
    // CROS
    cors: {
      origin: process.env.FRONTEND,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    let nineStocks = [
      "005930",
      "000660",
      "051910",
      "035420",
      "207940",
      "068270",
      "005380",
      "006400",
      "035720",
    ];
    console.log("Check Redis DB");

    await updateStocksBySocketRedis(nineStocks, socket);
    setInterval(async function () {
      console.log("Check Redis DB every one min!");
      await updateStocksBySocketRedis(nineStocks, socket);
    }, process.env.NINE_STOCK_TIME);
  });
}

async function updateStocksBySocketRedis(nineStocks, socket) {
  let redisTime = process.env.REDIS_STOCK_TIME;
  for (let i = 0; i < nineStocks.length; i++) {
    client.get(nineStocks[i], async function (err, response) {
      if (response === null) {
        let tblStockInfo = await getStockInfo(nineStocks[i]);
        // Add stockcode
        tblStockInfo.stockCode = nineStocks[i];
        client.set(nineStocks[i], JSON.stringify(tblStockInfo), "EX", redisTime);
        socket.emit(nineStocks[i], tblStockInfo);
      } else {
        console.log("get data from Redis");
        socket.emit(nineStocks[i], JSON.parse(response));
      }
    });
  }
}

// Mongo DB
export function stockSocket(httpserver) {
  const io = new socket.Server(httpserver, {
    path: "/stock",
    // CROS
    cors: {
      origin: process.env.FRONTEND,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    let nineStocks = [
      "005930",
      "000660",
      "051910",
      "035420",
      "207940",
      "068270",
      "005380",
      "006400",
      "035720",
    ];
    console.log("Check mongoDB!");
    await updateStocksBySocket(nineStocks, socket);
    setInterval(async function () {
      console.log("Check mongoDB every one min!");
      await updateStocksBySocket(nineStocks, socket);
    }, process.env.NINE_STOCK_TIME);
  });
}

async function updateStocksBySocket(nineStocks, socket) {
  for (let i = 0; i < nineStocks.length; i++) {
    const stock = await Stock.aggregate([
      { $match: { "koreaStocks.stockCode": nineStocks[i] } },
    ]);
    if (
      stock[stock.length - 1] === undefined ||
      stock[stock.length - 1] === ""
    ) {
      krxServer(nineStocks[i]);
    } else {
      console.log("mongoDB : " + `${nineStocks[i]}`);
      let lastStockData = stock[stock.length - 1].koreaStocks;
      socket.emit(nineStocks[i], lastStockData);
    }
  }
}

// Function for background
async function krxServer(stockCode) {
  let seoul = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  let seoulTime = new Date(seoul);
  let tblStockInfo = await getStockInfo(stockCode);
  tblStockInfo.stockCode = stockCode;
  let stock = new Stock({
    koreaStocks: tblStockInfo,
    created: seoulTime,
  });
  return await stock.save();
}
