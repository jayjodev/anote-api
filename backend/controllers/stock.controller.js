import Stock from "../models/Stock.js";
import { getStockInfo } from "./stock.api.js";

// one minute
const updateTime = 60000;

export const stockAPIs = (app) => {
  app.post("/api/stock", async (req, res) => {
    // Basic Error handling
    if (
      req.body.stockCode === null ||
      req.body.stockCode === undefined ||
      req.body.stockCode === ""
    ) {
      console.log("case 1: err");
      return res.send(400, "stockCode is not defined");
    }

    let stocks = await Stock.aggregate([
      { $match: { "koreaStocks.code": req.body.stockCode } },
    ]);

    // No database for stock code
    if (stocks[stocks.length - 1] == undefined) {
      console.log("case 2: get data from server");
      let tblStockInfo = await getStockInfo(req.body.stockCode);
      if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
        return res.send(tblStockInfo);
      }
      tblStockInfo.code = req.body.stockCode;
      const stock = new Stock({
        koreaStocks: tblStockInfo,
      });
      try {
        console.log("case 3: save data");
        await stock.save();
        return res.send(stock.koreaStocks);
      } catch (err) {
        console.log("case 4: err");
        return res.send(400, err);
      }
    }

    let dbData = new Date(stocks[stocks.length - 1].created);
    let now = new Date();
    console.log(now - dbData);
    if (now - dbData > updateTime) {
      let tblStockInfo = await getStockInfo(req.body.stockCode);
      tblStockInfo.code = req.body.stockCode;
      const stock = new Stock({
        koreaStocks: tblStockInfo,
      });
      try {
        console.log("case 5: save data");
        await stock.save();
        return res.send(stock.koreaStocks);
      } catch (err) {
        console.log("case 6: err");
        res.send(400, err);
      }
    } else {
      console.log("case 7: use cache");
      const stocks = await Stock.aggregate([
        { $match: { "koreaStocks.code": req.body.stockCode } },
      ]);
      return res.send(stocks[stocks.length - 1].koreaStocks);
    }
  });
};

// app.get("/api/stocks", async (req, res) => {
//   const stocks = await Stock.aggregate([
//     { $match: { "koreaStocks.JongName": "SamsungElectronics" } },
//   ]);
//   console.log(stocks.stock);
//   console.log(stocks.result);
//   console.log(stocks[0]);
//   // console.log(stocks[stocks.length-1]);

//   res.send(stocks);
// });
