const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key'; // Replace with your secret key

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1d' }); // Token expires in 1 day
}

function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle invalid token error
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      // Handle other types of errors (e.g., TokenExpiredError, NotBeforeError)
      console.error('Error while verifying token:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = { generateToken, verifyToken, authenticateToken };
