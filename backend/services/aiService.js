const { GoogleGenerativeAI } = require('@google/generative-ai');
const KNOWLEDGE_BASE = require('./knowledgeBase');

let genAI = null;
let model = null;

function initAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured. AI features will be disabled.');
    return false;
  }
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return true;
  } catch (error) {
    console.warn('Failed to initialize Gemini AI:', error.message);
    return false;
  }
}

const aiAvailable = initAI();

function buildClassificationPrompt(subject, description) {
  return `
You are a support ticket classifier for BookLeaf Publishing. Classify the following support query into EXACTLY ONE of these categories:

1. Royalty & Payments - Questions about royalties, payments, payouts, bank details, payment delays
2. ISBN & Metadata Issues - Questions about ISBN numbers, book metadata errors, wrong ISBN on platforms
3. Printing & Quality - Questions about print quality, misprints, binding defects, color issues, reprints
4. Distribution & Availability - Questions about book availability on platforms, stock sync, listing issues
5. Book Status & Production Updates - Questions about production stages, delays, current status
6. General Inquiry - Anything else that doesn't fit above

Also assign a priority level: Critical, High, Medium, or Low based on urgency.

Consider:
- Critical: Royalty non-payment for 6+ months, ISBN errors, complete printing failures
- High: Payment delays, quality issues, availability problems
- Medium: General status inquiries, metadata updates
- Low: Bio updates, general questions

Query Subject: ${subject}
Query Description: ${description}

Respond ONLY in this JSON format:
{ "category": "<category name exactly as listed>", "priority": "<Critical/High/Medium/Low>", "reasoning": "<brief reason>" }
`;
}

function buildDraftPrompt(ticketData) {
  const { subject, description, category, priority } = ticketData;

  return `
You are a helpful and professional support representative for BookLeaf Publishing. Your task is to draft a response to an author's support query.

IMPORTANT - Use the following BookLeaf Knowledge Base to inform your response:

${KNOWLEDGE_BASE}

Author Query:
Subject: ${subject}
Description: ${description}

Category: ${category || 'Not classified'}
Priority: ${priority || 'Not assigned'}

Write a response that:
1. Acknowledges the author's concern empathetically
2. Addresses their specific issue using policy from the Knowledge Base
3. Includes specific details (timeframes, amounts, next steps)
4. Ends with a clear next step
5. Is professional, warm, and sounds like a real BookLeaf representative

Write the response in first person, as if you are a BookLeaf support agent.
`;
}

async function classifyTicket(subject, description) {
  if (!aiAvailable) {
    return {
      category: 'General Inquiry',
      priority: 'Medium',
      reasoning: 'AI unavailable - default classification applied',
    };
  }

  try {
    const prompt = buildClassificationPrompt(subject, description);
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Invalid AI response format');
    }

    const parsed = JSON.parse(response.substring(jsonStart, jsonEnd + 1));
    return {
      category: parsed.category || 'General Inquiry',
      priority: parsed.priority || 'Medium',
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error('AI classification error:', error.message);
    return {
      category: 'General Inquiry',
      priority: 'Medium',
      reasoning: 'AI classification failed - default applied',
    };
  }
}

async function generateDraftResponse(ticketData) {
  if (!aiAvailable) {
    return 'Thank you for reaching out to BookLeaf Publishing. Our team has received your query and will review it shortly. We aim to respond to all inquiries within 24-48 hours. If you need immediate assistance, please contact our support team directly.';
  }

  try {
    const prompt = buildDraftPrompt(ticketData);
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('AI draft generation error:', error.message);
    return 'We have received your query and our team is reviewing it. We will get back to you within 24-48 hours with a detailed response.';
  }
}

module.exports = {
  classifyTicket,
  generateDraftResponse,
  aiAvailable,
};
