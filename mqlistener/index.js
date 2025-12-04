import amqplib from "amqplib";

const MQ_USER = process.env.MQ_USER;
const MQ_PASS = process.env.MQ_PASS;
const MQ_HOST = process.env.MQ_HOST;
const MQ_PORT = process.env.MQ_PORT;
const CHANNEL_NAME = process.env.CHANNEL_NAME;

const bootstrap = async () => {
  const connection = await amqplib.connect(
    `amqp://${MQ_USER}:${MQ_PASS}@${MQ_HOST}:${MQ_PORT}`
  );
  const channel = await connection.createChannel();
  await channel.assertQueue(CHANNEL_NAME);
  channel.consume(
    CHANNEL_NAME,
    (message) => console.log("message tut", message.content.toString()),
    { noAck: true }
  );
};

bootstrap();
