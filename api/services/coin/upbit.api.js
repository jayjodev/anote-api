import fetch from "node-fetch";

async function getCoinInfo(coinCode) {
  let requestOptions = {
    method: "GET",
  };

  return fetch(`https://api.upbit.com/v1/ticker?markets=${coinCode}`, requestOptions)
    .then((response) => response.text())
    .then(function (result) {
      return result;
    })
    .catch((err) => err);
}

export { getCoinInfo };
