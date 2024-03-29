import fetch from "node-fetch";

async function getUpbitCoinInfo(coinCode) {
  let requestOptions = {
    method: "GET",
  };

  return fetch(
    `https://api.upbit.com/v1/ticker?markets=${coinCode}`,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}

async function getbithumbCoinInfo(coinCode) {
  let requestOptions = {
    method: "GET",
  };
  return fetch(
    `https://api.bithumb.com/public/ticker/${coinCode}`,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}

async function getCoinoneCoinInfo(coinCode) {
  let requestOptions = {
    method: "GET",
  };
  return fetch(
    `https://api.coinone.co.kr/ticker?currency=${coinCode}`,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}

// Global
async function getbinanceCoinInfo() {
  let requestOptions = {
    method: "GET",
  };
  return fetch(
    `https://api.binance.com/api/v3/ticker/price`,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}

async function getPoloniexCoinInfo() {
  let requestOptions = {
    method: "GET",
  };
  return fetch(
    `https://poloniex.com/public?command=returnTicker`,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}


async function getbybitCoinInfo() {
  let requestOptions = {
    method: "GET",
  };
  return fetch(
    `https://api.bybit.com/v2/public/tickers`,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}

export {
  getUpbitCoinInfo,
  getCoinoneCoinInfo,
  getbithumbCoinInfo,
  getbinanceCoinInfo,
  getPoloniexCoinInfo,
  getbybitCoinInfo,
};
