import express from "express";
import amqplib from "amqplib";

const MQ_USER = process.env.MQ_USER;
const MQ_PASS = process.env.MQ_PASS;
const MQ_HOST = process.env.MQ_HOST;
const MQ_PORT = process.env.MQ_PORT;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
const APP_PORT = process.env.APP_PORT;

const bootstrap = async () => {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const connection = await amqplib.connect(
    `amqp://${MQ_USER}:${MQ_PASS}@${MQ_HOST}:${MQ_PORT}`
  );
  const channel = await connection.createChannel();
  await channel.assertQueue(CHANNEL_NAME);
  // app.post("message", (req, res) => {
  //   const message = JSON.stringify(req.body);
  //   channel.sendToQueue("mqchannel", message);
  //   res.status(201).json({
  //     message: "OK",
  //   });
  // });

  app.get("", (req, res) => {
    const message = JSON.stringify(req.query);
    channel.sendToQueue(CHANNEL_NAME, Buffer.from(message));
    res.status(201).json({
      message: "OK",
    });
    // console.log(
    //   `[3000] REQUEST IS HANDLED, QUERY: ${JSON.stringify(req.query)}`
    // );
    // res.end();
  });

  app.listen(APP_PORT, () => console.log("APP STARTED"));
};

bootstrap();
