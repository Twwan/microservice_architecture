import logger from './logger.js';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

const authenticate = async (req, res, next) => {
  const requestId = req.requestId;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authentication failed: no token provided', {
      requestId: requestId,
      method: req.method,
      path: req.path,
    });
    return res.status(401).json({
      error: 'Authentication required. Please provide a valid token.',
    });
  }

  const token = authHeader.substring(7);

  try {
    logger.info('Validating token', {
      requestId: requestId,
      method: req.method,
      path: req.path,
    });

    const response = await fetch(`${AUTH_SERVICE_URL}/validate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Request-ID': requestId,
      },
    });

    if (!response.ok) {
      logger.warn('Authentication failed: invalid token', {
        requestId: requestId,
        status: response.status,
        method: req.method,
        path: req.path,
      });
      return res.status(401).json({
        error: 'Invalid token. Authentication failed.',
      });
    }

    const userData = await response.json();
    req.user = userData;

    logger.info('Authentication successful', {
      requestId: requestId,
      userId: userData.userId,
      login: userData.login,
      method: req.method,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('Authentication error', {
      requestId: requestId,
      error: error.message,
      method: req.method,
      path: req.path,
    });
    return res.status(500).json({
      error: 'Authentication service unavailable',
    });
  }
};

export default authenticate;

