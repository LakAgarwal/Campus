import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.warn("Groq API Key missing: AI features will be disabled.");
}

// Only export ONE instance of groq
export const groq = apiKey 
  ? new Groq({ apiKey, dangerouslyAllowBrowser: true }) 
  : null;