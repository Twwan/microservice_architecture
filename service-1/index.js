import express from "express";

const app = express();

app.get("", (req, res) => {
  console.log(`[3000] REQUEST IS HANDLED, QUERY: ${JSON.stringify(req.query)}`);
  res.end();
});

app.listen(3000, () => console.log("APP STARTED"));
