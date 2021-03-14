import { getbybitCoinInfo } from "./coin.api.js";
import { client } from "../../index.js";

import dotenv from "dotenv";
dotenv.config();

let redisTime = process.env.REDIS_STOCK_TIME;
export const bybitService = async function (req, res) {

  let bybitRedisKey = "bybit" + req.body.coinCode;

  client.get(bybitRedisKey, async function (err, response) {
    if (response === null) {
      console.log(`get data from server and save in Redis in ${redisTime}`);
      let result = await getbybitCoinInfo();

      let obj = JSON.parse(result).result;
      let result_coin_obj = obj.filter((a) => a.symbol === req.body.coinCode);
      let result_coin_str = JSON.stringify(result_coin_obj[0]);
      client.set(bybitRedisKey, result_coin_str, "EX", redisTime);
      return res.send(result_coin_str);
    } else {
      console.log("get data from Redis");
      return res.send(JSON.parse(response));
    }
  });
};