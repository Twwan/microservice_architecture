import amqplib from "amqplib";
import logger from "./logger.js";

const MQ_USER = process.env.MQ_USER;
const MQ_PASS = process.env.MQ_PASS;
const MQ_HOST = process.env.MQ_HOST;
const MQ_PORT = process.env.MQ_PORT;
const CHANNEL_NAME = process.env.CHANNEL_NAME;

const bootstrap = async () => {
  // Подключение к RabbitMQ
  const connection = await amqplib.connect(
    `amqp://${MQ_USER}:${MQ_PASS}@${MQ_HOST}:${MQ_PORT}`
  );
  const channel = await connection.createChannel();
  await channel.assertQueue(CHANNEL_NAME);

  logger.info("MQ Listener started", {
    channel: CHANNEL_NAME,
    host: MQ_HOST,
  });

  // Обработка сообщений из очереди
  channel.consume(
    CHANNEL_NAME,
    (message) => {
      if (message) {
        const content = message.content.toString();
        let messageData;
        try {
          messageData = JSON.parse(content);
        } catch (e) {
          messageData = { raw: content };
        }

        // Извлечение Request ID из сообщения
        const requestId = messageData.requestId || 'unknown';

        logger.info("Message received from queue", {
          requestId: requestId,
          channel: CHANNEL_NAME,
          messageData: messageData,
        });
      }
    },
    { noAck: true }
  );
};

bootstrap();
