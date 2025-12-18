import express from 'express';
import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
const DB_NAME = process.env.DB_NAME || 'lab_database';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const bootstrap = async () => {
  const app = express();
  app.use(express.json());

  let connection;
  let retries = 10;

  while (retries > 0) {
    try {
      connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        charset: 'utf8mb4'
      });
      console.log('Connected to MySQL database');
      break;
    } catch (error) {
      console.error('Database connection error:', error.message);
      retries--;
      if (retries === 0) {
        console.error('Failed to connect to database');
        process.exit(1);
      }
      console.log(`Retrying in 3 seconds... (${retries} attempts left)`);
      await sleep(3000);
    }
  }

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('Tables created successfully');

  app.get('/', (req, res) => {
    res.json({ message: 'Database Backup Lab API', endpoints: ['/users', '/products'] });
  });

  app.post('/users', async (req, res) => {
    try {
      const { name, email } = req.body;
      const [result] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
      );
      res.json({ id: result.insertId, name, email });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/users', async (req, res) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/products', async (req, res) => {
    try {
      const { name, price, quantity } = req.body;
      const [result] = await connection.execute(
        'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
        [name, price, quantity]
      );
      res.json({ id: result.insertId, name, price, quantity });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/products', async (req, res) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM products');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
};

bootstrap();
