import fetch from "node-fetch";
import convert from "xml-js";

export function getStockInfo(stockCode) {
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
