import { getCoinoneCoinInfo } from "./coin.api.js";
import { client } from "../../index.js";
import dotenv from "dotenv";
dotenv.config();

let redisTime = process.env.REDIS_STOCK_TIME;

export const coinoneService = async function (req, res) {
  client.get(req.body.coinCode, async function (err, response) {
    if (response === null) {
      console.log(`get data from server and save in Redis in ${redisTime}`);
      let result = await getCoinoneCoinInfo(req.body.coinCode);
      client.set(req.body.coinCode, JSON.stringify(result), "EX", redisTime);
      return res.send(result);
    } else {
      console.log("get data from Redis");
      return res.send(JSON.parse(response));
    }
  });
};
