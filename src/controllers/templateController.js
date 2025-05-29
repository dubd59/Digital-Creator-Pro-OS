const { PrismaClient } = require('@prisma/client');
const { generateTemplate } = require('../services/openaiService');
const prisma = new PrismaClient();

// Create a new template
const createTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, isPublic = false, content } = req.body;
    
    const template = await prisma.templateDefinition.create({
      data: {
        userProfileId: userId,
        title,
        description,
        isPublic,
        versions: {
          create: {
            versionNumber: 1,
            content
          }
        }
      },
      include: {
        versions: true
      }
    });
    
    res.status(201).json({
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: true, message: 'Failed to create template' });
  }
};

// Get all templates for the current user
const getTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const templates = await prisma.templateDefinition.findMany({
      where: {
        userProfileId: userId
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: 'desc'
          },
          take: 1
        },
        tags: true
      }
    });
    
    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: true, message: 'Failed to get templates' });
  }
};

// Get a specific template by ID
const getTemplateById = async (req, res) => {
  try {
    const userId = req.user.id;
    const templateId = parseInt(req.params.id);
    
    const template = await prisma.templateDefinition.findFirst({
      where: {
        id: templateId,
        userProfileId: userId
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: 'desc'
          }
        },
        tags: true
      }
    });
    
    if (!template) {
      return res.status(404).json({ error: true, message: 'Template not found' });
    }
    
    res.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: true, message: 'Failed to get template' });
  }
};

// Update a template
const updateTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const templateId = parseInt(req.params.id);
    const { title, description, isPublic, content } = req.body;
    
    // Check if template exists and belongs to user
    const existingTemplate = await prisma.templateDefinition.findFirst({
      where: {
        id: templateId,
        userProfileId: userId
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: 'desc'
          },
          take: 1
        }
      }
    });
    
    if (!existingTemplate) {
      return res.status(404).json({ error: true, message: 'Template not found' });
    }
    
    // Update template
    const updatedTemplate = await prisma.templateDefinition.update({
      where: { id: templateId },
      data: {
        title,
        description,
        isPublic,
        dateUpdated: new Date()
      }
    });
    
    // Create new version if content is provided
    if (content) {
      const latestVersion = existingTemplate.versions[0];
      const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
      
      await prisma.templateVersion.create({
        data: {
          definitionId: templateId,
          versionNumber: newVersionNumber,
          content
        }
      });
    }
    
    res.json({
      message: 'Template updated successfully',
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: true, message: 'Failed to update template' });
  }
};

// Delete a template
const deleteTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const templateId = parseInt(req.params.id);
    
    // Check if template exists and belongs to user
    const template = await prisma.templateDefinition.findFirst({
      where: {
        id: templateId,
        userProfileId: userId
      }
    });
    
    if (!template) {
      return res.status(404).json({ error: true, message: 'Template not found' });
    }
    
    // Delete template versions and tags first (cascade delete)
    await prisma.templateVersion.deleteMany({
      where: { definitionId: templateId }
    });
    
    await prisma.templateTag.deleteMany({
      where: { definitionId: templateId }
    });
    
    // Delete template
    await prisma.templateDefinition.delete({
      where: { id: templateId }
    });
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: true, message: 'Failed to delete template' });
  }
};

// Generate a template using OpenAI
const generateTemplateWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, purpose, audience, layout, title } = req.body;
    
    // Generate template content using OpenAI
    const generatedContent = await generateTemplate(prompt, purpose, audience, layout);
    
    // Create template with generated content
    const template = await prisma.templateDefinition.create({
      data: {
        userProfileId: userId,
        title: title || `Generated Template - ${new Date().toISOString().split('T')[0]}`,
        description: `Generated from prompt: ${prompt}`,
        isPublic: false,
        versions: {
          create: {
            versionNumber: 1,
            content: generatedContent
          }
        }
      },
      include: {
        versions: true
      }
    });
    
    // Log OpenAI request
    const apiKey = await prisma.openaiApiKey.findFirst({
      where: { userProfileId: userId }
    });
    
    if (apiKey) {
      const requestLog = await prisma.openaiRequestLog.create({
        data: {
          apiKeyId: apiKey.id,
          requestPayload: JSON.stringify({ prompt, purpose, audience, layout })
        }
      });
      
      await prisma.openaiResponseLog.create({
        data: {
          requestLogId: requestLog.id,
          responsePayload: generatedContent,
          statusCode: 200
        }
      });
    }
    
    res.status(201).json({
      message: 'Template generated successfully',
      template,
      content: generatedContent
    });
  } catch (error) {
    console.error('Generate template error:', error);
    res.status(500).json({ error: true, message: 'Failed to generate template' });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  generateTemplateWithAI
};