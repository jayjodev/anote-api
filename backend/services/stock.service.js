import log4js from "log4js";
import Stock from "../models/Stock.js";
import { getStockInfo } from "../controllers/stock.api.js";
import dotenv from "dotenv";
dotenv.config();

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
// Ten seconds
const updateTime = process.env.INPUT_STOCK_TIME;

export const stockServiceFunction = async function (req, res) {
  let seoul = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  let seoulTime = new Date(seoul);
  let week = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );

  let seoulDay = new Date(seoul).getDate();
  let seoulToday = new Date(seoul).getDay();
  let seoulTodayLabel = week[seoulToday];
  let seoulTimeHours = new Date(seoul).getHours();
  let seoulTimeMinutes = new Date(seoul).getMinutes();
  let seoulTimeHoursMinutes = seoulTimeHours * 60 + seoulTimeMinutes;

  let ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  logger.info("IP address" + ip);
  console.log("IP address" + ip);

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
    { $match: { "koreaStocks.stockCode": req.body.stockCode } },
  ]);

  // No database for stock code
  if (stocks[stocks.length - 1] == undefined) {
    logger.info("case 2: get data from server");
    console.log("case 2: get data from server");
    let tblStockInfo = await getStockInfo(req.body.stockCode);
    if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
      return res.send(tblStockInfo);
    }
    tblStockInfo.stockCode = req.body.stockCode;
    const stock = new Stock({
      koreaStocks: tblStockInfo,
      created: seoulTime,
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

  // The DB Data is available
  let dbData = new Date(stocks[stocks.length - 1].created);

  logger.info("Seoul Hours: " + seoulTimeHours);
  console.log("Seoul Hours: " + seoulTimeHours);
  logger.info(seoulTime - dbData);
  console.log(seoulTime - dbData);
  logger.info(seoulTimeHoursMinutes);
  console.log(seoulTimeHoursMinutes);

  // DB 날짜가 다를 경우 무조건
  if (dbData.getDate() != seoulDay) {
    logger.info("case 5: new day get data from server and save");
    console.log("case 5: new day get data from erver and save");
    let tblStockInfo = await getStockInfo(req.body.stockCode);
    tblStockInfo.stockCode = req.body.stockCode;
    let stock = new Stock({
      koreaStocks: tblStockInfo,
      created: seoulTime,
    });
    await stock.save();
    return res.send(stock.koreaStocks);
  }

  /* Stock Market : 8시 30분 = 510
    장마감 : 16시 = 960
    Saturday Sunday 안함. */

  if (
    seoulTime - dbData > updateTime &&
    510 <= seoulTimeHoursMinutes &&
    960 >= seoulTimeHoursMinutes &&
    !("Sunday" === seoulTodayLabel) &&
    !("Saturday" === seoulTodayLabel)
  ) {
    try {
      logger.info("case 6: use cache and call case 8");
      console.log("case 6: use cache");
      const stocks = await Stock.aggregate([
        { $match: { "koreaStocks.stockCode": req.body.stockCode } },
      ]);

      // Call the APIs
      krxServer(req);
      return res.send(stocks[stocks.length - 1].koreaStocks);
    } catch (err) {
      logger.error("case 7:" + err);
      console.log("case 7: err");
      res.send(400, err);
    }
  } else {
    logger.info("case 7: use cache");
    console.log("case 7: use cache");
    const stocks = await Stock.aggregate([
      { $match: { "koreaStocks.stockCode": req.body.stockCode } },
    ]);
    return res.send(stocks[stocks.length - 1].koreaStocks);
  }
};

// Function for background
async function krxServer(req) {
  let seoul = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  let seoulTime = new Date(seoul);
  logger.info("case 8: API call and Save Data");
  console.log("case 8: API call and Save Data");
  let tblStockInfo = await getStockInfo(req.body.stockCode);
  tblStockInfo.stockCode = req.body.stockCode;
  let stock = new Stock({
    koreaStocks: tblStockInfo,
    created: seoulTime,
  });
  return await stock.save();
}
