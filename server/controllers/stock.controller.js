const Stock = require("../models/Stock");
const fetch = require("node-fetch");
const convert = require("xml-js");

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
      const TBL_StockInfo = await getStockInfo(req.body.stockCode);
      res.send(TBL_StockInfo);
    }
  });
};
