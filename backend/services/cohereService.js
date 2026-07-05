const callCohere = async (query, systemPrompt) => {
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-r-08-2024',
      preamble: systemPrompt,  // Cohere calls the system prompt "preamble"
      message: query,
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Cohere error: ${data.message || 'Unknown error'}`);
  }

  return data.text;
};

module.exports = { callCohere };
