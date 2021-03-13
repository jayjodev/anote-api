import * as fs from "fs";
import { upbitService } from "../services/coin/upbit.service.js";
import { bithumbService } from "../services/coin/bithumb.service.js";


export const coinAPIs = (app) => {
  app.post("/api/upbit/coins", async (req, res) => {
    return await upbitService(req, res);
  });

  app.post("/api/bithumb/coins", async (req, res) => {
    return await bithumbService(req, res);
  });
};