const MAX_QUESTION_LENGTH = 1200;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function sendJson(res, status, payload) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(payload);
}

function normalizeQuestion(value) {
  return String(value || '').trim().slice(0, MAX_QUESTION_LENGTH);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, { error: 'AI service is not configured. Add OPENAI_API_KEY in Vercel environment variables.' });
  }

  const question = normalizeQuestion(req.body?.question);
  const lang = req.body?.lang === 'ar' ? 'ar' : 'en';
  const role = ['trainee', 'trainer', 'admin'].includes(req.body?.role) ? req.body.role : 'trainee';

  if (question.length < 3) {
    return sendJson(res, 400, { error: lang === 'ar' ? 'اكتب سؤالًا تدريبيًا واضحًا.' : 'Please enter a clear training question.' });
  }

  const systemPrompt = lang === 'ar'
    ? `أنت CathLab AI Tutor داخل منصة تعليمية للقسطرة القلبية. أجب بالعربية المبسطة مع إبقاء المصطلحات الطبية المهمة بالإنجليزية. دور المستخدم: ${role}. اجعل الإجابة تعليمية، عملية، ومنظمة. لا تعطي أوامر علاجية نهائية ولا تتجاوز سياسات المستشفى. أضف تنبيهًا قصيرًا أن المحتوى للتعليم فقط وليس بديلًا عن الحكم السريري أو سياسة المستشفى.`
    : `You are CathLab AI Tutor inside a cardiac catheterization training platform. User role: ${role}. Answer in a clear educational style for Cath Lab learners. Be practical, structured, and concise. Do not provide final clinical orders or override hospital policy. Add a short education-only disclaimer.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 650,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || 'OpenAI request failed';
      return sendJson(res, response.status, { error: message });
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return sendJson(res, 502, { error: 'AI returned an empty response.' });
    }

    return sendJson(res, 200, { answer, model: data?.model || process.env.AI_MODEL || 'gpt-4o-mini' });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'AI service error' });
  }
}
