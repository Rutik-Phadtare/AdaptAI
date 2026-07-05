const callGemini = async (query, systemPrompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: query }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Gemini error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.candidates[0].content.parts[0].text;
};

module.exports = { callGemini };
