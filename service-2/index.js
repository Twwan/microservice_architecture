import express from "express";
import { randomUUID } from "crypto";
import logger from "./logger.js";

const APP_PORT = process.env.APP_PORT || 3001;

const app = express();

// Middleware для генерации и передачи Request ID
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
});

// Обработка входящих запросов
app.get("", (req, res) => {
  const requestId = req.requestId;
  logger.info("Request received", {
    requestId: requestId,
    query: req.query,
    method: req.method,
    path: req.path,
  });
  res.status(201).json({
    message: "OK",
  });
  logger.info("Response sent", {
    requestId: requestId,
    status: 201,
  });
});

app.listen(APP_PORT, () => {
  logger.info("Service started", { port: APP_PORT });
});
