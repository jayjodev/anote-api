import { getbithumbCoinInfo } from "./coin.api.js";
import { client } from "../../index.js";

import dotenv from "dotenv";
dotenv.config();

let redisTime = process.env.REDIS_STOCK_TIME;
export const bithumbService = async function (req, res) {
  let bithumbRedisKey = "bithumb" + req.body.coinCode;

  client.get(bithumbRedisKey, async function (err, response) {
    if (response === null) {
      console.log(`get data from server and save in Redis in ${redisTime}`);
      let result = await getbithumbCoinInfo(req.body.coinCode);
      client.set(bithumbRedisKey, result, "EX", redisTime);
      return res.send(result);
    } else {
      console.log("get data from Redis");
      return res.send(JSON.parse(response));
    }
  });
};
