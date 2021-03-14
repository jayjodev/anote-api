import * as fs from "fs";
import { upbitService } from "../services/coin/upbit.service.js";
import { bithumbService } from "../services/coin/bithumb.service.js";
import { binanceService } from "../services/coin/binance.service.js";
import { coinoneService } from "../services/coin/coinone.service.js";

export const coinAPIs = (app) => {
  app.post("/api/upbit/coins", async (req, res) => {
    return await upbitService(req, res);
  });

  app.post("/api/bithumb/coins", async (req, res) => {
    return await bithumbService(req, res);
  });

  app.post("/api/binance/coins", async (req, res) => {
    return await binanceService(req, res);
  });

  app.post("/api/coinone/coins", async (req, res) => {
    return await coinoneService(req, res);
  })
};