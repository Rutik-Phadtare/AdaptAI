const callGroq = async (query, systemPrompt) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
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
    throw new Error(`Groq error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.choices[0].message.content;
};

module.exports = { callGroq };
