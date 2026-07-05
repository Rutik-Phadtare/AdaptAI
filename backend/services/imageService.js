// Pollinations.ai — completely free, no API key needed, ever
// Returns a URL you can directly use as <img src="..."> on the frontend
const generateImageUrl = (prompt, width = 512, height = 512) => {
  const seed = Math.floor(Math.random() * 99999);
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}&enhance=true`;
};

module.exports = { generateImageUrl };
