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

export { getUpbitCoinInfo, getbithumbCoinInfo };
