const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getContextForCategory, allSections } = require('./knowledgeBase');

let genAI = null;
let model = null;
let tokenUsage = { classification: 0, draft: 0, total: 0 };

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
    console.warn('Failed to initialize Gemini:', error.message);
    return false;
  }
}

const aiAvailable = initAI();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(prompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const usage = response.usageMetadata;
      if (usage) {
        const tokens = (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0);
        tokenUsage.total += tokens;
        return response.text().trim();
      }
      return response.text().trim();
    } catch (error) {
      const isQuota = error.message?.includes('429') || error.message?.includes('quota');
      const isRateLimit = error.message?.includes('429') || error.message?.includes('rate');

      if ((isQuota || isRateLimit) && attempt < retries) {
        const delay = Math.pow(2, attempt) * 2000;
        console.warn(`AI rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
}

function buildClassificationPrompt(subject, description) {
  return `
Classify this BookLeaf support query into EXACTLY ONE category and assign priority.

Categories:
- Royalty & Payments: royalties, payments, payouts, bank details, payment delays
- ISBN & Metadata Issues: ISBN numbers, metadata errors, wrong ISBN on platforms
- Printing & Quality: print quality, misprints, binding defects, color issues, reprints
- Distribution & Availability: book availability, stock sync, listing issues
- Book Status & Production Updates: production stages, delays, current status
- General Inquiry: anything else

Priority levels (based on urgency):
- Critical: no royalty for 6+ months, ISBN errors, complete printing failure
- High: payment delays, quality issues, availability problems
- Medium: status inquiries, metadata updates
- Low: bio updates, general questions

Subject: ${subject}
Description: ${description}

Respond ONLY with JSON:
{ "category": "<exact category name>", "priority": "<Critical|High|Medium|Low>", "reasoning": "<one line reason>" }
`;
}

function buildDraftPrompt(ticketData) {
  const { subject, description, category, priority, authorName, bookTitle, bookStatus, recentMessages } = ticketData;

  const context = getContextForCategory(category);

  const history = recentMessages && recentMessages.length > 0
    ? recentMessages.map((m) => `${m.sender === 'author' ? 'Author' : 'Support Agent'}: ${m.text}`).join('\n')
    : 'No previous messages.';

  return `
You are a BookLeaf Publishing support representative. Draft a professional, empathetic response to this author query.

CONTEXT (BookLeaf policies):
${context}

AUTHOR QUERY:
Subject: ${subject}
Description: ${description}
${authorName ? `Author: ${authorName}` : ''}
${bookTitle ? `Book: ${bookTitle}` : ''}
${bookStatus ? `Book Status: ${bookStatus}` : ''}
Classification: ${category || 'General'}
Priority: ${priority || 'Medium'}

CONVERSATION HISTORY:
${history}

Write a response in first person as a BookLeaf support agent that:
1. Opens with acknowledgment of the author's specific concern
2. Addresses the issue using relevant BookLeaf policy from the context
3. Includes specific details: timeframes, amounts, next steps (not vague reassurances)
4. Is conversational, warm, and professional — like a real BookLeaf team member
5. Ends with a clear call to action or next step for the author

Keep it concise. Sign off naturally (no formal "Best regards" needed).
`;
}

async function classifyTicket(subject, description) {
  tokenUsage.classification++;
  const fallback = {
    category: 'General Inquiry',
    priority: 'Medium',
    reasoning: 'AI unavailable - default applied',
  };

  if (!aiAvailable) return fallback;

  try {
    const prompt = buildClassificationPrompt(subject, description);
    const text = await generateWithRetry(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    const validCategories = [
      'Royalty & Payments', 'ISBN & Metadata Issues', 'Printing & Quality',
      'Distribution & Availability', 'Book Status & Production Updates', 'General Inquiry',
    ];
    const validPriorities = ['Critical', 'High', 'Medium', 'Low'];

    return {
      category: validCategories.includes(parsed.category) ? parsed.category : fallback.category,
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : fallback.priority,
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error('AI classification failed:', error.message.substring(0, 100));
    return { ...fallback, reasoning: `AI error: ${error.message.substring(0, 60)}` };
  }
}

async function generateDraftResponse(ticketData) {
  tokenUsage.draft++;
  const fallback = 'Thank you for reaching out to BookLeaf Publishing. Our team has received your query and will review it shortly. We aim to respond within 24-48 hours. If you need immediate assistance, please contact our support team directly.';

  if (!aiAvailable) return fallback;

  try {
    const prompt = buildDraftPrompt(ticketData);
    return await generateWithRetry(prompt);
  } catch (error) {
    console.error('AI draft generation failed:', error.message.substring(0, 100));
    return fallback;
  }
}

function getAIStatus() {
  return {
    available: aiAvailable,
    model: aiAvailable ? 'gemini-1.5-flash' : null,
    tokenUsage,
    uptime: process.uptime(),
  };
}

module.exports = {
  classifyTicket,
  generateDraftResponse,
  getAIStatus,
  aiAvailable,
};
