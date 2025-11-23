import express from "express";
import amqplib from "amqplib";

const bootstrap = async () => {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const connection = await amqplib.connect(`amqp://admin:admin@rabbitmq:5672`);
  const channel = await connection.createChannel();
  await channel.assertQueue("mqchannel");
  // app.post("message", (req, res) => {
  //   const message = JSON.stringify(req.body);
  //   channel.sendToQueue("mqchannel", message);
  //   res.status(201).json({
  //     message: "OK",
  //   });
  // });

  app.get("", (req, res) => {
    const message = JSON.stringify(req.query);
    channel.sendToQueue("mqchannel", Buffer.from(message));
    res.status(201).json({
      message: "OK",
    });
    // console.log(
    //   `[3000] REQUEST IS HANDLED, QUERY: ${JSON.stringify(req.query)}`
    // );
    // res.end();
  });

  app.listen(3000, () => console.log("APP STARTED"));
};

bootstrap();
