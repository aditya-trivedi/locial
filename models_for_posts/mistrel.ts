import "dotenv/config";
const apiKey = process.env.MISTRAL_API_KEY;

export async function callMistral(prompt: string) {
  const response = await fetch(
    "https://api.mistral.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mistral API Error: ${response.status}`
    );
  }

  const data = await response.json();

  return data.choices[0].message.content;
}