import express from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import logger from './logger.js';

// Настройка переменных окружения
const AUTH_PORT = process.env.AUTH_PORT;
const JWT_SECRET = process.env.JWT_SECRET;

// Создание Express приложения
const app = express();
// Установка middleware для парсинга JSON
app.use(express.json({ limit: '10mb' }));

// Хранилище пользователей
const users = new Map();
// Хранилище токенов
const tokens = new Map();

// Middleware для установки идентификатора запроса
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Метод регистрации пользователя
app.post('/register', (req, res) => {
  const requestId = req.requestId;
  const { login, password } = req.body;

  logger.info('Registration attempt', {
    requestId: requestId,
    login: login,
  });

  // Проверка наличия учетных данных
  if (!login || !password) {
    logger.warn('Registration failed: missing credentials', {
      requestId: requestId,
      login: login,
    });
    return res.status(400).json({
      error: 'Login and password are required',
    });
  }

  // Проверка существования пользователя
  if (users.has(login)) {
    logger.warn('Registration failed: user already exists', {
      requestId: requestId,
      login: login,
    });
    return res.status(409).json({
      error: 'User already exists',
    });
  }

  // Создание нового пользователя
  const userId = randomUUID();
  users.set(login, {
    id: userId,
    login: login,
    password: password,
  });

  logger.info('User registered successfully', {
    requestId: requestId,
    userId: userId,
    login: login,
  });

  res.status(201).json({
    message: 'User registered successfully',
    userId: userId,
  });
});

// Метод авторизации пользователя
app.post('/login', (req, res) => {
  const requestId = req.requestId;
  const { login, password } = req.body;

  logger.info('Login attempt', {
    requestId: requestId,
    login: login,
  });

  // Проверка наличия учетных данных
  if (!login || !password) {
    logger.warn('Login failed: missing credentials', {
      requestId: requestId,
      login: login,
    });
    return res.status(400).json({
      error: 'Login and password are required',
    });
  }

  // Проверка валидности учетных данных
  const user = users.get(login);
  if (!user || user.password !== password) {
    logger.warn('Login failed: invalid credentials', {
      requestId: requestId,
      login: login,
    });
    return res.status(401).json({
      error: 'Invalid credentials',
    });
  }

  // Генерация JWT токена
  const token = jwt.sign(
    {
      userId: user.id,
      login: user.login,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Сохранение токена в хранилище
  tokens.set(token, {
    userId: user.id,
    login: user.login,
    createdAt: new Date().toISOString(),
  });

  logger.info('User logged in successfully', {
    requestId: requestId,
    userId: user.id,
    login: user.login,
  });

  res.status(200).json({
    token: token,
    user: {
      id: user.id,
      login: user.login,
    },
  });
});

// Метод валидации токена
app.get('/validate', (req, res) => {
  const requestId = req.requestId;
  const authHeader = req.headers.authorization;

  // Проверка наличия токена в заголовке
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Token validation failed: no token provided', {
      requestId: requestId,
    });
    return res.status(401).json({
      error: 'Token is required',
    });
  }

  // Извлечение токена из заголовка
  const token = authHeader.substring(7);

  try {
    // Верификация JWT токена
    const decoded = jwt.verify(token, JWT_SECRET);
    // Проверка наличия токена в хранилище
    const tokenData = tokens.get(token);

    if (!tokenData) {
      logger.warn('Token validation failed: token not found', {
        requestId: requestId,
        userId: decoded.userId,
      });
      return res.status(401).json({
        error: 'Invalid token',
      });
    }

    logger.info('Token validated successfully', {
      requestId: requestId,
      userId: decoded.userId,
      login: decoded.login,
    });

    res.status(200).json({
      userId: decoded.userId,
      login: decoded.login,
    });
  } catch (error) {
    logger.warn('Token validation failed: invalid token', {
      requestId: requestId,
      error: error.message,
    });
    return res.status(401).json({
      error: 'Invalid token',
    });
  }
});

// Запуск сервера авторизации
app.listen(AUTH_PORT, () => {
  logger.info('Auth service started', { port: AUTH_PORT });
});

