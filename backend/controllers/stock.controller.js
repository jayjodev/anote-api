import * as fs from "fs";
import { stockServiceFunction } from "../services/stock.service.js";

export const stockAPIs = (app) => {
  app.post("/api/stocks", async (req, res) => {
    // Time zone
    return await stockServiceFunction(req, res);
  });

  app.get("/api/logs", async (req, res) => {
    const logs = fs.readFileSync("./stock.log").toString("utf-8");
    return res.send(logs);
  });
};