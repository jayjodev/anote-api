import Stock from "../models/Stock.js";
import { getStockInfo } from "./stock.api.js";

// 매 30초
const updateTime = 30000;

export const stockAPIs = (app) => {
  app.post("/api/stock", async (req, res) => {
    if (
      req.body.stockCode === null ||
      req.body.stockCode === undefined ||
      req.body.stockCode === ""
    ) {
      res.send(400, "stockCode is not defined");
    } else {
      const stocks = await Stock.aggregate([
        { $match: { "koreaStocks.code": req.body.stockCode } },
      ]);
      if (stocks[stocks.length - 1] == undefined) {
        let tblStockInfo = await getStockInfo(req.body.stockCode);
        if (tblStockInfo.JongName === "" || tblStockInfo.JongName === null) {
          res.send(400, err);
        } else {
          tblStockInfo.code = req.body.stockCode;
          const stock = new Stock({
            koreaStocks: tblStockInfo,
          });
          // console.log("case A");
          try {
            await stock.save();
            res.send(stock.koreaStocks);
          } catch (err) {
            res.send(400, err);
          }
        }
      } else {
        let dbData = new Date(stocks[stocks.length - 1].created);
        let now = new Date();
        console.log(now - dbData);
        if (now - dbData > updateTime) {
          let tblStockInfo = await getStockInfo(req.body.stockCode);
          tblStockInfo.code = req.body.stockCode;
          const stock = new Stock({
            koreaStocks: tblStockInfo,
          });
          // console.log("case B");
          try {
            await stock.save();
            res.send(stock.koreaStocks);
          } catch (err) {
            res.send(400, err);
          }
        } else {
          const stocks = await Stock.aggregate([
            { $match: { "koreaStocks.code": req.body.stockCode } },
          ]);
          // console.log("case C");
          res.send(stocks[stocks.length - 1].koreaStocks);
        }
      }
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
