const fs = require('fs');
const path = require('path');

const files = [
  { path: '.env', content: `# Example environment variables
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
OPENAI_API_KEY=your_openai_api_key
` },
  { path: 'package.json', content: `{
  "name": "digital-creator-pro-os",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.14.0",
    "dotenv": "^16.4.5",
    "stripe": "^14.0.0",
    "openai": "^4.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
` },
  { path: 'prisma/schema.prisma', content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
` },
  { path: 'src/config/database.js', content: `require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
` },
  { path: 'src/config/stripe.js', content: `require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
` },
  { path: 'src/controllers/authController.js', content: `exports.login = (req, res) => {
  res.send('Login endpoint');
};

exports.register = (req, res) => {
  res.send('Register endpoint');
};
` },
  { path: 'src/controllers/templateController.js', content: `exports.getTemplates = (req, res) => {
  res.send('Get templates endpoint');
};
` },
  { path: 'src/controllers/subscriptionController.js', content: `exports.subscribe = (req, res) => {
  res.send('Subscribe endpoint');
};
` },
  { path: 'src/middleware/auth.js', content: `module.exports = (req, res, next) => {
  // Add authentication logic here
  next();
};
` },
  { path: 'src/middleware/subscription.js', content: `module.exports = (req, res, next) => {
  // Add subscription check logic here
  next();
};
` },
  { path: 'src/models/index.js', content: `const prisma = require('../config/database');
module.exports = { prisma };
` },
  { path: 'src/routes/auth.js', content: `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
` },
  { path: 'src/routes/template.js', content: `const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/', templateController.getTemplates);

module.exports = router;
` },
  { path: 'src/routes/webhook.js', content: `const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.send('Webhook endpoint');
});

module.exports = router;
` },
  { path: 'src/services/openaiService.js', content: `require('dotenv').config();
const { OpenAIApi, Configuration } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = openai;
` },
  { path: 'src/services/stripeService.js', content: `const stripe = require('../config/stripe');

module.exports = stripe;
` },
  { path: 'src/utils/logger.js', content: `module.exports = {
  log: (message) => {
    console.log('[LOG]: ' + message);
  }
};
` },
  { path: 'src/app.js', content: `const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/templates', require('./routes/template'));
app.use('/api/webhook', require('./routes/webhook'));

module.exports = app;
` },
  { path: 'server.js', content: `require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
` },
];

files.forEach(file => {
  const dir = path.dirname(file.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content, { flag: 'w' });
    console.log('Created: ' + file.path);
  } else {
    console.log('Skipped (already exists): ' + file.path);
  }
});