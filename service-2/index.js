import express from "express";

const app = express();

app.get("", (req, res) => {
  console.log(`[3001] REQUEST IS HANDLED, QUERY: ${JSON.stringify(req.query)}`);
  res.end();
});

app.listen(3001, () => console.log("APP STARTED"));
