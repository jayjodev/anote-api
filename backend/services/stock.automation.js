import Stock from "../models/Stock.js";
import { getStockInfo } from "../controllers/stock.api.js";

export function everyOneMinUpdateNineStocks() {
  let seoul = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  let week = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );
  let seoulToday = new Date(seoul).getDay();
  let seoulTodayLabel = week[seoulToday];
  let seoulTimeHours = new Date(seoul).getHours();
  let seoulTimeMinutes = new Date(seoul).getMinutes();
  let seoulTimeHoursMinutes = seoulTimeHours * 60 + seoulTimeMinutes;

  let nineStocks = [
    "005930",
    "000660",
    "051910",
    "035420",
    "207940",
    "068270",
    "005380",
    "006400",
    "035720",
  ];

  for (let i = 0; i < nineStocks.length; i++) {
    if (
      510 <= seoulTimeHoursMinutes &&
      960 >= seoulTimeHoursMinutes &&
      !("Sunday" === seoulTodayLabel) &&
      !("Saturday" === seoulTodayLabel)
    ) {
      console.log("Save Data to MongoDB from KRX")
      krxServer(nineStocks[i]);
    } else {
      console.log("KRX is not opened")
    }
  }

  async function krxServer(stockCode) {
    let seoul = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
    });
    let seoulTime = new Date(seoul);
    let tblStockInfo = await getStockInfo(stockCode);
    tblStockInfo.stockCode = stockCode;
    let stock = new Stock({
      koreaStocks: tblStockInfo,
      created: seoulTime,
    });
    return await stock.save();
  }
}
