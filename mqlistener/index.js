import amqplib from "amqplib";

const bootstrap = async () => {
  const connection = await amqplib.connect(`amqp://admin:admin@rabbitmq:5672`);
  const channel = await connection.createChannel();
  await channel.assertQueue("mqchannel");
  channel.consume(
    "mqchannel",
    (message) => console.log("message tut", message.content.toString()),
    { noAck: true }
  );
};

bootstrap();
