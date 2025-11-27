import { GoogleGenAI } from "@google/genai";

// CAUTION: Using process.env.API_KEY as per instructions.
// In a real production app, this should be proxied through a backend to protect the key.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generateStoryContinuation = async (
  currentContent: string,
  style: string = 'creative'
): Promise<string> => {
  if (!apiKey) {
      console.warn("No API Key found");
      return "请配置 API Key 以使用 AI 功能。";
  }

  try {
    const prompt = `你是一个乐于助人的小说合著者。
    这是章节的最后一部分：
    "${currentContent.slice(-1000)}"
    
    请用中文继续写大约 200-300 字。
    保持语调和风格。
    风格提示：${style}。
    只提供续写的内容，不要包含任何元数据或解释。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成内容时出错，请重试。";
  }
};

export const generateChapterOutline = async (title: string, novelDescription: string): Promise<string> => {
    if (!apiKey) return "API Key 缺失。";
    try {
        const prompt = `为一本描述为：“${novelDescription}” 的小说中的章节 “${title}” 创建一个 5 点大纲。请用中文回复，并以项目符号列表的形式返回。`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || '';
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "生成大纲出错。";
    }
};