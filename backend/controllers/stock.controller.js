var fs = require("fs");
// var stockTxt = fs.readFileSync("./data/koreastocks.txt").toString("utf-8");
const Stock = require("../models/Stock");
const fetch = require("node-fetch");
const convert = require("xml-js");

// 매 30초
const updateTime = 30000;

function getStockInfo(stockCode) {
  return fetch(
    `http://asp1.krx.co.kr/servlet/krx.asp.XMLSiseEng?code=${stockCode}`,
    {
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  )
    .then(function (res) {
      let xml_txt = res.text();
      return xml_txt;
    })
    .then(function (res) {
      let converToString = convert.xml2json(res, { compact: true, spaces: 4 });
      let convertToJSON = JSON.parse(converToString);
      return convertToJSON.stockprice.TBL_StockInfo._attributes;
    })
    .catch((err) => err);
}

module.exports = (app) => {
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

      if (!stocks) {
        let tblStockInfo = await getStockInfo(req.body.stockCode);
        tblStockInfo.code = req.body.stockCode;
        const stock = new Stock({
          koreaStocks: tblStockInfo,
        });
        try {
          await stock.save();
          res.send(stock.koreaStocks);
        } catch (err) {
          res.send(400, err);
        }
      }

      if (stocks) {
        var dbData = new Date(stocks[stocks.length - 1].created);
        var now = new Date();
        console.log(now - dbData);
        if (now - dbData > updateTime) {
          // const TBL_StockInfo = await getStockInfo(req.body.stockCode);
          // res.send(TBL_StockInfo);
          let tblStockInfo = await getStockInfo(req.body.stockCode);
          tblStockInfo.code = req.body.stockCode;
          const stock = new Stock({
            koreaStocks: tblStockInfo,
          });
          console.log("case A");
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
          console.log("case B");
          res.send(stocks[stocks.length - 1].koreaStocks);
        }
      }
    }
  });
};

//   app.get("/api/stocks", async (req, res) => {
//     const stocks = await Stock.aggregate([
//       { $match: { "koreaStocks.JongName": "SamsungElectronics" } },
//     ]);
//     console.log(stocks.stock);
//     console.log(stocks.result);
//     console.log(stocks[0]);
//     // console.log(stocks[stocks.length-1]);

//     res.send(stocks);
//   });
