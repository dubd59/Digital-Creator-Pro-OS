const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'User with this email or username already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        fullName,
      }
    });
    
    // Create default user role (assuming 'user' role exists)
    const userRole = await prisma.authRole.findFirst({
      where: { name: 'user' }
    });
    
    if (userRole) {
      await prisma.authUserRole.create({
        data: {
          userProfileId: user.id,
          roleId: userRole.id
        }
      });
    }
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: true, message: 'Failed to register user' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email
    };
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Store token in database
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    await prisma.authToken.create({
      data: {
        token,
        userProfileId: user.id,
        expiresAt
      }
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: true, message: 'Failed to login' });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      // Delete token from database
      await prisma.authToken.deleteMany({
        where: { token }
      });
    }
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: true, message: 'Failed to logout' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        uuid: true,
        username: true,
        email: true,
        fullName: true,
        bio: true,
        dateCreated: true,
        dateUpdated: true,
        subscriptions: {
          where: {
            status: 'active'
          },
          include: {
            plan: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: true, message: 'Failed to get user profile' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};