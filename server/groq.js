const axios = require("axios");
require("dotenv").config();

async function askGroq(messages) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.groq_key}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = askGroq;