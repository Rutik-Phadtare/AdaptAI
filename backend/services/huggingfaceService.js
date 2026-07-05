const callHuggingFace = async (query, systemPrompt) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const prompt = `[INST] <<SYS>>\n${systemPrompt}\n<</SYS>>\n\n${query} [/INST]`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Wait-For-Model': 'true', // ← KEY FIX: tells HF to wait for cold start
                                       //   instead of returning 503 immediately
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
      // Now we get the real HTTP error message (403, 503, etc.)
      throw new Error(`HTTP ${response.status}: ${data.error || JSON.stringify(data)}`);
    }

    const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    if (!text?.trim()) throw new Error('Empty response — model returned nothing');
    return text;

  } catch (err) {
    // Detect if OUR timeout fired (AbortController)
    if (err.name === 'AbortError' || err.cause?.name === 'AbortError') {
      throw new Error('HuggingFace: timed out after 45s (model cold start too slow)');
    }
    // Pass the real network error code up to the orchestrator log
    const causeCode = err.cause?.code || err.cause?.message || '';
    throw new Error(`HuggingFace: ${err.message}${causeCode ? ` (${causeCode})` : ''}`);
  } finally {
    clearTimeout(timeoutId);
  }
};

module.exports = { callHuggingFace };