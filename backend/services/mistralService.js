const callMistral = async (query, systemPrompt) => {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Mistral error: ${data.message || 'Unknown error'}`);
  }

  return data.choices[0].message.content;
};

module.exports = { callMistral };
