import Stock from "../models/Stock.js";
import { getStockInfo } from "./stock.api.js";
import * as fs from "fs";
import log4js from "log4js";

log4js.configure({
  appenders: { stock: { type: "file", filename: "stock.log" } },
  categories: {
    default: {
      appenders: ["stock"],
      level: "info",
    },
  },
});
let logger = log4js.getLogger("stock");
logger.level = "error";

// One minute
const updateTime = 60000;

export const stockAPIs = (app) => {
  app.post("/api/stock", async (req, res) => {
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
      logger.error("case 1: err");
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
        logger.error("case 4:" + err);
        console.log("case 4: err");
        return res.send(400, err);
      }
    }

    let dbData = new Date(stocks[stocks.length - 1].created);
    let now = new Date();
    console.log(now - dbData);
    if (now - dbData > updateTime) {
      let tblStockInfo = await getStockInfo(req.body.stockCode);
      tblStockInfo.code = req.body.stockCode;
      const stock = new Stock({
        koreaStocks: tblStockInfo,
      });
      try {
        logger.info("case 5: save data");
        console.log("case 5: save data");
        await stock.save();
        return res.send(stock.koreaStocks);
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
    logger.info("Search Log");
    console.log("Search Log");
    const logs = fs.readFileSync("./stock.log").toString("utf-8");
    return res.send(logs);
  });
};
