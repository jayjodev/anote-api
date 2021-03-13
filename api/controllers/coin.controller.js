import * as fs from "fs";
import { upbitService } from "../services/coin/upbit.service.js";

export const coinAPIs = (app) => {
  app.post("/api/upbit/coins", async (req, res) => {
    return await upbitService(req, res);
  });
};