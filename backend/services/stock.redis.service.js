import log4js from "log4js";
import { getStockInfo } from "../controllers/stock.api.js";
import dotenv from "dotenv";
import { client } from "../index.js";
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
let redisTime = process.env.REDIS_STOCK_TIME;

export const stockRedisService = async function (req, res) {
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

  if (
    510 <= seoulTimeHoursMinutes &&
    960 >= seoulTimeHoursMinutes &&
    !("Sunday" === seoulTodayLabel) &&
    !("Saturday" === seoulTodayLabel)
  ) {
    // 장 중 Rdis Setting 60 Seconds
    client.get(req.body.stockCode, async function (err, response) {
      if (response === null) {
        logger.info(
          `case 2: get data from server and save in Redis in ${redisTime}`
        );
        console.log(
          `case 2: get data from server and save in Redis in ${redisTime}`
        );
        let tblStockInfo = await getStockInfo(req.body.stockCode);
        if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
          return res.send(tblStockInfo);
        }
        // JongName이 존재할 때만

        tblStockInfo.stockCode = req.body.stockCode;
        client.set(
          req.body.stockCode,
          JSON.stringify(tblStockInfo),
          "EX",
          redisTime
        );
        return res.send(tblStockInfo);
      } else {
        logger.info("case 3: get data from Redis");
        console.log("case 3: get data from Redis");
        // client.ttl(req.body.stockCode, function (err, res) {
        //   console.log(res);
        // });
        return res.send(JSON.parse(response));
      }
    });
  }

  // 장중이 아닐때  Rdis Setting 10시간
  client.get(req.body.stockCode, async function (err, response) {
    if (response === null) {
      logger.info("case 4: get data from server and save in Redis");
      console.log("case 4: get data from server and save in Redis");
      let tblStockInfo = await getStockInfo(req.body.stockCode);
      if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
        return res.send(tblStockInfo);
      }
      
      tblStockInfo.stockCode = req.body.stockCode;
      client.set(
        req.body.stockCode,
        JSON.stringify(tblStockInfo),
        "EX",
        60 * 60 * 10
      );
      return res.send(tblStockInfo);
    } else {
      logger.info("case 5: get data from Redis");
      console.log("case 5: get data from Redis");
      return res.send(JSON.parse(response));
    }
  });
};
