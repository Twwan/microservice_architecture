import express from "express";

const app = express();

app.get("", (req, res) => {
  console.log(`[3001] REQUEST IS HANDLED, QUERY: ${JSON.stringify(req.query)}`);
  res.status(201).json({
    message: "OK",
  });
});

app.listen(3001, () => console.log("APP STARTED"));
