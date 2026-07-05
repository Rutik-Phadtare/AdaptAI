const callHuggingFace = async (query, systemPrompt) => {
  // HuggingFace models can take 20-30 seconds on first call (cold start)
  // We use AbortController to cancel if it takes too long
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const prompt = `[INST] <<SYS>>\n${systemPrompt}\n<</SYS>>\n\n${query} [/INST]`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 600,
            return_full_text: false,
            temperature: 0.7,
            do_sample: true,
          },
        }),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HuggingFace error: ${data.error || 'Unknown error'}`);
    }

    // HF returns an array with one object
    return Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

  } finally {
    clearTimeout(timeoutId); // always clear timeout whether it succeeded or failed
  }
};

module.exports = { callHuggingFace };
