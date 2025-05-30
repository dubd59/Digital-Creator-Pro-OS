const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a template using OpenAI
 * @param {string} prompt - The user's prompt
 * @param {string} purpose - The purpose of the template
 * @param {string} audience - The target audience
 * @param {string} layout - The desired layout
 * @returns {Promise<string>} - The generated template content
 */
const generateTemplate = async (prompt, purpose, audience, layout) => {
  try {
    const systemPrompt = `You are a professional template creator. Create a detailed Notion template based on the following requirements:
    - Purpose: ${purpose}
    - Target Audience: ${audience}
    - Layout Style: ${layout}
    
    Format the template as clean Markdown that can be directly imported into Notion.
    Include appropriate sections, headings, and structure.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate template with OpenAI');
  }
};

module.exports = {
  generateTemplate
};