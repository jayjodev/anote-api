import log4js from "log4js";
import { getUpbitCoinInfo } from "./coin.api.js";
import { client } from "../../index.js";
import dotenv from "dotenv";
dotenv.config();

let redisTime = process.env.REDIS_STOCK_TIME;

export const upbitService = async function (req, res) {
  
  let upbitRedisKey = "upbit" + req.body.coinCode
  
  client.get(upbitRedisKey, async function (err, response) {
    if (response === null) {
      console.log(`get data from server and save in Redis in ${redisTime}`);
      let result = await getUpbitCoinInfo(req.body.coinCode);
      client.set(upbitRedisKey, result, "EX", redisTime);
      return res.send(result);
    } else {
      return res.send(JSON.parse(response));
    }
  });
};
