import express from "express";
import amqplib from "amqplib";
import { randomUUID } from "crypto";
import logger from "./logger.js";
import authenticate from "./authenticate.js";

const MQ_USER = process.env.MQ_USER;
const MQ_PASS = process.env.MQ_PASS;
const MQ_HOST = process.env.MQ_HOST;
const MQ_PORT = process.env.MQ_PORT;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
const SERVICE1_PORT = process.env.SERVICE1_PORT;

const bootstrap = async () => {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Middleware для генерации и передачи Request ID
  app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  });

  // Подключение к RabbitMQ
  const connection = await amqplib.connect(
    `amqp://${MQ_USER}:${MQ_PASS}@${MQ_HOST}:${MQ_PORT}`
  );
  const channel = await connection.createChannel();
  await channel.assertQueue(CHANNEL_NAME);

  app.use(authenticate);

  // Обработка входящих запросов
  app.get("", (req, res) => {
    const requestId = req.requestId;
    logger.info("Request received", {
      requestId: requestId,
      query: req.query,
      method: req.method,
      path: req.path,
    });

    // Формирование сообщения с Request ID для RabbitMQ
    const messageData = {
      ...req.query,
      requestId: requestId,
    };
    const message = JSON.stringify(messageData);
    channel.sendToQueue(CHANNEL_NAME, Buffer.from(message));

    logger.info("Message sent to queue", {
      requestId: requestId,
      channel: CHANNEL_NAME,
    });

    res.status(201).json({
      message: "OK",
    });
    logger.info("Response sent", {
      requestId: requestId,
      status: 201,
    });
  });

  app.listen(SERVICE1_PORT, () => {
    logger.info("Service started", { port: SERVICE1_PORT });
  });
};

bootstrap();
