import pkg from "js-base64";
const { encode, decode } = pkg;

export const forBase64 = (app) => {
  app.post("/api/encode", async (req, res) => {
    try {
      let encodedData = encode(req.body.inputForEncode);
      return res.send(encodedData);
    } catch (err) {
      return res.send(err, "error");
    }
  });

  app.post("/api/decode", async (req, res) => {
    try {
      let decodedData = decode(req.body.inputForDecode);
      return res.send(decodedData);
    } catch (err) {
      return res.send(err, "error");
    }
  });
};
