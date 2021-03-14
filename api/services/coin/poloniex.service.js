import { getPoloniexCoinInfo } from "./coin.api.js";
import { client } from "../../index.js";
import dotenv from "dotenv";
dotenv.config();

let redisTime = process.env.REDIS_STOCK_TIME;

export const poloniexService = async function (req, res) {

  let poloniexRedisKey = "poloniex" + req.body.coinCode;

  client.get(poloniexRedisKey, async function (err, response) {
    if (response === null) {
      console.log(`get data from server and save in Redis in ${redisTime}`);
      let result = await getPoloniexCoinInfo();
      let obj = JSON.parse(result);
      let result_coin_obj = obj.USDT_BTC
      let result_coin_str = JSON.stringify(result_coin_obj);
      client.set(poloniexRedisKey, result_coin_str, "EX", redisTime);
      return res.send(result);
    } else {
      console.log("get data from Redis");
      return res.send(JSON.parse(response));
    }
  });
};
