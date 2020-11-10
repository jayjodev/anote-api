import * as fs from "fs";
import log4js from "log4js";
import Stock from "../models/Stock.js";
import { getStockInfo } from "./stock.api.js";

log4js.configure({
  appenders: {
    stock: { type: "file", filename: "stock.log" },
  },
  categories: {
    default: {
      appenders: ["stock"],
      level: "info",
    },
  },
});
let logger = log4js.getLogger("stock");
// one seconds
const updateTime = 1000;
let seoulTime = new Date().toLocaleString("en-US", {
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

export const stockAPIs = (app) => {
  app.post("/api/stocks", async (req, res) => {
    let ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    logger.info(ip);
    console.log(ip);

    // Basic Error handling
    if (
      req.body.stockCode === null ||
      req.body.stockCode === undefined ||
      req.body.stockCode === ""
    ) {
      logger.fatal("case 1: stockCode is not defined");
      console.log("case 1: err");
      return res.send(400, "stockCode is not defined");
    }

    let stocks = await Stock.aggregate([
      { $match: { "koreaStocks.code": req.body.stockCode } },
    ]);

    // No database for stock code
    if (stocks[stocks.length - 1] == undefined) {
      logger.info("case 2: get data from server");
      console.log("case 2: get data from server");
      let tblStockInfo = await getStockInfo(req.body.stockCode);
      if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
        return res.send(tblStockInfo);
      }
      tblStockInfo.code = req.body.stockCode;
      const stock = new Stock({
        koreaStocks: tblStockInfo,
      });
      try {
        logger.info("case 3: save data");
        console.log("case 3: save data");
        await stock.save();
        return res.send(stock.koreaStocks);
      } catch (err) {
        logger.fatal("case 4:" + err);
        console.log("case 4: err");
        return res.send(400, err);
      }
    }

    let dbData = new Date(stocks[stocks.length - 1].created);
    let now = new Date();
    let seoulToday = new Date(seoulTime).getDay();
    let seoulTodayLabel = week[seoulToday];
    let seoulTimeHours = new Date(seoulTime).getHours();
    let seoulTimeMinutes = new Date(seoulTime).getMinutes();
    let seoulTimeHoursMinutes = seoulTimeHours * 60 + seoulTimeMinutes;
    // 장시작 : 8시 30분 = 510
    // 장마감 : 16시 = 960
    // 토요일 일요일 안함.
    logger.info("Seoul Hours: " + seoulTimeHours);
    console.log("Seoul Hours: " + seoulTimeHours);
    logger.info(now - dbData);
    console.log(now - dbData);
    // console.log("DataBase" + now - dbData);
    if (
      now - dbData > updateTime &&
      510 <= seoulTimeHoursMinutes &&
      960 >= seoulTimeHoursMinutes &&
      !("Sunday" === seoulTodayLabel) &&
      !("Saturday" === seoulTodayLabel)
    ) {
      try {
        logger.info("case 5: use cache and save data");
        console.log("case 5: use cache and save data");
        const stocks = await Stock.aggregate([
          { $match: { "koreaStocks.code": req.body.stockCode } },
        ]);

        krxServer(req);
        return res.send(stocks[stocks.length - 1].koreaStocks);
      } catch (err) {
        logger.error("case 6:" + err);
        console.log("case 6: err");
        res.send(400, err);
      }
    } else {
      logger.info("case 7: use cache");
      console.log("case 7: use cache");
      const stocks = await Stock.aggregate([
        { $match: { "koreaStocks.code": req.body.stockCode } },
      ]);
      return res.send(stocks[stocks.length - 1].koreaStocks);
    }
  });

  app.get("/api/logs", async (req, res) => {
    const logs = fs.readFileSync("./stock.log").toString("utf-8");
    return res.send(logs);
  });
};

async function krxServer(req) {
  logger.info("case 8: API call and Save Data");
  console.log("case 8: API call and Save Data");
  let tblStockInfo = await getStockInfo(req.body.stockCode);
  tblStockInfo.code = req.body.stockCode;
  let stock = new Stock({
    koreaStocks: tblStockInfo,
  });
  logger.info(tblStockInfo);
  console.log(tblStockInfo);
  return await stock.save();
}

/*
*장 전 시간 외 - 08:30 ~ 08:40[1]
장 시작 동시호가 - 08:30 ~ 09:00[2]
정규시간 - 09:00 ~ 15:30[3]
장 마감 동시호가 - 15:20 ~ 15:30
장 후 시간 외 - 15:40 ~ 16:00[4]
시간 외 단일가 - 16:00 ~ 18:00[5]
*/
