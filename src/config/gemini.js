import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const genAI = new GoogleGenerativeAI(apiKey || 'MISSING_KEY');
export const getAiModel = () => genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
