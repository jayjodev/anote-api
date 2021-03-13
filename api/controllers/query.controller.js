import * as query from "query-string";

export const forQueryString = (app) => {
  app.post("/api/parse-url", async (req, res) => {
    try {
      let parseUrlData = query.parseUrl(req.body.inputForParseUrl);
      return res.send(parseUrlData);
    } catch (err) {
      return res.send(err, "error");
    }
  });
};
