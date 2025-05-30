const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: true, message: 'Access token is required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in database
    const tokenRecord = await prisma.authToken.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });
    
    if (!tokenRecord) {
      return res.status(403).json({ error: true, message: 'Invalid or expired token' });
    }
    
    req.user = tokenRecord.user;
    next();
  } catch (error) {
    return res.status(403).json({ error: true, message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };