import * as fs from "fs";
import { stockServiceFunction } from "../services/stock.service.js";
import { stockRedisService } from "../services/stock.redis.service.js";

export const stockAPIs = (app) => {
  app.post("/api/stocks", async (req, res) => {
    return await stockRedisService(req, res);
  });

  app.get("/api/logs", async (req, res) => {
    const logs = fs.readFileSync("./stock.log").toString("utf-8");
    return res.send(logs);
  });
};