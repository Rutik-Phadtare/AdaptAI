const { callGroq } = require('./groqService');
const { callGemini } = require('./geminiService');
const { callCohere } = require('./cohereService');
const { callHuggingFace } = require('./huggingfaceService');
const { callMistral } = require('./mistralService');
const { LEVEL_PROMPTS, getSynthesizerPrompt } = require('../utils/levelPrompts');

// ─── Synthesizer ──────────────────────────────────────────────────────────────
// Takes all successful responses and asks Groq to merge them into one answer
const synthesize = async (responses, level) => {
  // Number each response clearly so the synthesizer can compare them
  const combined = responses
    .map((text, index) => `=== Response ${index + 1} ===\n${text.trim()}`)
    .join('\n\n');

  const result = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: getSynthesizerPrompt(level) },
        { role: 'user', content: combined },
      ],
      max_tokens: 1200,
      temperature: 0.4, // lower temp for synthesis = more stable/accurate merge
    }),
  });

  const data = await result.json();
  return data.choices[0].message.content;
};

// ─── MAIN ORCHESTRATOR ────────────────────────────────────────────────────────
const orchestrate = async (query, level = 'adult') => {
  const systemPrompt = LEVEL_PROMPTS[level];

  console.log(`\n🚀 AdaptAI query: "${query}" | Level: ${level}`);
  console.log('📡 Firing all 5 APIs in parallel...');

  const startTime = Date.now();

  // Promise.allSettled fires ALL 5 at once and waits for all to finish/fail
  // It NEVER throws — failed ones get status:'rejected', successful ones get status:'fulfilled'
  const results = await Promise.allSettled([
    callGroq(query, systemPrompt),
    callGemini(query, systemPrompt),
    callCohere(query, systemPrompt),
    callHuggingFace(query, systemPrompt),
    callMistral(query, systemPrompt),
  ]);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Separate successes and failures
  const successful = results
    .filter(r => r.status === 'fulfilled' && r.value?.trim().length > 20)
    .map(r => r.value);

  const failed = results.filter(r => r.status === 'rejected');

  // Log result in terminal for easy debugging
  console.log(`✅ ${successful.length}/5 APIs responded in ${elapsed}s`);
  if (failed.length > 0) {
    console.log(`⚠️  ${failed.length} failed:`, failed.map(f => f.reason?.message));
  }

  if (successful.length === 0) {
    throw new Error('All AI APIs failed to respond. Please try again in a moment.');
  }

  // Only 1 response came back — just return it, no need to synthesize
  if (successful.length === 1) {
    console.log('↩️  Only 1 response — returning directly (no synthesis needed)');
    return successful[0];
  }

  // 2+ responses — synthesize into one best answer
  console.log(`🔀 Synthesizing ${successful.length} responses...`);
  const finalAnswer = await synthesize(successful, level);
  console.log('✨ Done!\n');

  return finalAnswer;
};

module.exports = { orchestrate };
