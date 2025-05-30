const express = require('express');
const router = express.Router();
const { 
  createTemplate, 
  getTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate,
  generateTemplateWithAI
} = require('../controllers/templateController.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');
const { checkActiveSubscription } = require('../middleware/subscription.cjs');

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