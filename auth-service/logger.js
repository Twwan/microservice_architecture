import winston from 'winston';
import { createConnection } from 'net';

const LOGSTASH_HOST = process.env.LOGSTASH_HOST;
const LOGSTASH_PORT = parseInt(process.env.LOGSTASH_PORT, 10);

// Транспорт для отправки логов в Logstash по TCP
class LogstashTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.logstashHost = options.logstashHost;
    this.logstashPort = options.logstashPort;
    this.client = null;
    this.reconnect();
  }

  // Метод переподключения к Logstash
  reconnect() {
    try {
      this.client = createConnection(this.logstashPort, this.logstashHost);
      this.client.on('error', () => {
        this.client = null;
        setTimeout(() => this.reconnect(), 5000);
      });
    } catch (error) {
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  // Метод логирования в Logstash
  log(info, callback) {
    if (this.client && this.client.writable) {
      const logMessage = JSON.stringify(info) + '\n';
      this.client.write(logMessage);
    }
    callback();
  }
}

// Настройка логгера с единым форматом JSON
const logger = winston.createLogger({
  level: 'info',
  // Настройка формата логов
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  // Метаданные по умолчанию
  defaultMeta: {
    service: 'auth-service',
  },
  // Настройка транспортов для вывода логов
  transports: [
    // Транспорт для вывода в консоль
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Транспорт для отправки в Logstash
    new LogstashTransport({
      logstashHost: LOGSTASH_HOST,
      logstashPort: LOGSTASH_PORT,
    }),
  ],
});

export default logger;

