const express = require('express');
const router = express.Router();
const { 
  createTemplate, 
  getTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate,
  generateTemplateWithAI
} = require('../controllers/templateController');
const { authenticateToken } = require('../middleware/auth');
const { checkActiveSubscription } = require('../middleware/subscription');

// All routes require authentication
router.use(authenticateToken);

// Basic CRUD operations
router.post('/', createTemplate);
router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

// AI template generation (requires subscription)
router.post('/generate', checkActiveSubscription, generateTemplateWithAI);

module.exports = router;