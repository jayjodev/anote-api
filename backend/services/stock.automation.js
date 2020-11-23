import Stock from "../models/Stock.js";
import { getStockInfo } from "../controllers/stock.api.js";
import dotenv from "dotenv";
import { client } from "../index.js";
dotenv.config();

export function everyOneMinUpdateNineStocksRedis() {
  let seoul = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  let week = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );
  let seoulToday = new Date(seoul).getDay();
  let seoulTodayLabel = week[seoulToday];
  let seoulTimeHours = new Date(seoul).getHours();
  let seoulTimeMinutes = new Date(seoul).getMinutes();
  let seoulTimeHoursMinutes = seoulTimeHours * 60 + seoulTimeMinutes;

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

  for (let i = 0; i < nineStocks.length; i++) {
    if (
      510 <= seoulTimeHoursMinutes &&
      960 >= seoulTimeHoursMinutes &&
      !("Sunday" === seoulTodayLabel) &&
      !("Saturday" === seoulTodayLabel)
    ) {
      krxCall(nineStocks[i]);
    } else {
      console.log("KRX is not opened");
    }
  }
}

async function krxCall(stockCode) {

  let redisTime = process.env.REDIS_STOCK_TIME;
  client.get(stockCode, async function (err, response) {
    if (response === null) {
      console.log(
        `every one min: get data from server and save in Redis in ${redisTime}`
      );
      let tblStockInfo = await getStockInfo(stockCode);
      if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
        return res.send(tblStockInfo);
      }
      // JongName이 존재할 때만
      tblStockInfo.stockCode = stockCode;
      client.set(stockCode, JSON.stringify(tblStockInfo), "EX", redisTime);
      return res.send(tblStockInfo);
    } else {
      console.log("get data from Redis");
      // client.ttl(stockCode, function (err, res) {
      //   console.log(res);
      // });
      return res.send(JSON.parse(response));
    }
  });
}



export function everyOneMinUpdateNineStocks() {
  let seoul = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  let week = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );
  let seoulToday = new Date(seoul).getDay();
  let seoulTodayLabel = week[seoulToday];
  let seoulTimeHours = new Date(seoul).getHours();
  let seoulTimeMinutes = new Date(seoul).getMinutes();
  let seoulTimeHoursMinutes = seoulTimeHours * 60 + seoulTimeMinutes;

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

  for (let i = 0; i < nineStocks.length; i++) {
    if (
      510 <= seoulTimeHoursMinutes &&
      960 >= seoulTimeHoursMinutes &&
      !("Sunday" === seoulTodayLabel) &&
      !("Saturday" === seoulTodayLabel)
    ) {
      console.log("Save Data to MongoDB from KRX");
      krxServer(nineStocks[i]);
    } else {
      console.log("KRX is not opened");
    }
  }

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
}
