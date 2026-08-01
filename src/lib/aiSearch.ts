// Resume context for AI assistant
const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Harsh Upadhyay
Role: BCA (Bachelor of Computer Applications) Student — 1st Semester
Location: Faridabad, India
Email: harsh48227@gmail.com
LinkedIn: linkedin.com/in/harsh-upadhyay-a014783b4
GitHub: github.com/Dev-Harshupadhyay
PROFESSIONAL SUMMARY:
I'm a BCA 1st semester student and a self-taught, passionate full-stack web developer. I started coding out of curiosity and have been building real projects ever since — learning by doing rather than waiting to "finish a course" first. I enjoy turning ideas into working products and I'm just getting started on this journey.
TECHNICAL SKILLS:
Programming Languages:
- JavaScript, TypeScript, basics of C++ and Python
Frameworks & Technologies:
- React, Node.js, Express
- MongoDB, MySQL
- TailwindCSS
- Git & GitHub
PROJECT PORTFOLIO:
1. Cinevood
   - A movie discovery/browsing web app
   - Live at cinenvood.onrender.com
2. Tarazu
   - A calculator/utility web app ("tarazu" = weighing scale)
   - Live at tarzau.netlify.app
3. ClimaTek (Atmosphera)
   - A real-time weather intelligence dashboard with forecasts, UV index and air quality data
   - Live at climatek.netlify.app
ADDITIONAL INFORMATION:
Languages: English, Hindi
`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// Fallback responses for common queries when AI fails
const fallbackResponses: Record<string, string> = {
  "work style": "I like keeping things simple — clear goals, clean code, and steady progress. As I'm early in my journey, I focus a lot on learning by actually building rather than just following tutorials.",
  "experience": "I'm just starting out — currently a BCA 1st semester student who has been building real projects like Cinevood, Tarazu, and ClimaTek to learn full-stack development hands-on.",
  "skills": "I'm comfortable with JavaScript/TypeScript, React, Node.js, Express, MongoDB, MySQL, and TailwindCSS, with the basics of C++ and Python as well.",
  "education": "I'm currently a BCA (Bachelor of Computer Applications) 1st semester student, and I'm passionate about full-stack web development.",
  "projects": "My portfolio includes Cinevood (a movie discovery app), Tarazu (a utility/calculator web app), and ClimaTek (a weather intelligence dashboard).",
  "contact": "You can reach me at harsh48227@gmail.com, connect on LinkedIn, or check out my work on GitHub (github.com/Dev-Harshupadhyay).",
  "achievements": "I'm early in my journey — right now my focus is on building and shipping real projects as I start my BCA degree.",
  "availability": "I'm open to internships, freelance work, and collaboration opportunities in full-stack web development.",
  "text": "You can reach me via email (harsh48227@gmail.com), LinkedIn, or GitHub (github.com/Dev-Harshupadhyay).",
  "contact information": "Feel free to reach out via email at harsh48227@gmail.com or connect with me on LinkedIn.",
};

function getFallbackResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for exact matches first
  if (fallbackResponses[normalizedQuery]) {
    return fallbackResponses[normalizedQuery];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      return value;
    }
  }
  
  return null;
}

export async function queryAI(query: string): Promise<string> {
  try {
    // Support multiple Gemini keys. The environment can provide:
    // - VITE_GEMINI_API_KEYS (comma-separated list)
    // - VITE_GEMINI_API_KEY1 ... VITE_GEMINI_API_KEY5
    // - fallback VITE_GEMINI_API_KEY (single key)
    const env = (import.meta as any).env || {};

    function getGeminiKeys(): string[] {
      const keys: string[] = [];
      if (env.VITE_GEMINI_API_KEYS) {
        keys.push(...String(env.VITE_GEMINI_API_KEYS).split(',').map((k: string) => k.trim()).filter(Boolean));
      }
      for (let i = 1; i <= 5; i++) {
        const k = env[`VITE_GEMINI_API_KEY${i}`];
        if (k) keys.push(String(k));
      }
      if (env.VITE_GEMINI_API_KEY) {
        keys.push(String(env.VITE_GEMINI_API_KEY));
      }
      // de-duplicate while preserving order
      return Array.from(new Set(keys));
    }

    // Persistent rotation index: pick a random initial key per user, then rotate
    function consumeStartIndex(n: number): number {
      if (n <= 0) return 0;
      try {
        const stored = localStorage.getItem('gemini_key_index');

        // If we have a stored next-index, use it. Otherwise, pick a random start
        if (stored) {
          let idx = parseInt(stored, 10);
          const start = idx % n;
          idx = (idx + 1) % n;
          localStorage.setItem('gemini_key_index', String(idx));
          return start;
        } else {
          const randomStart = Math.floor(Math.random() * n);
          const next = (randomStart + 1) % n;
          localStorage.setItem('gemini_key_index', String(next));
          return randomStart;
        }
      } catch (e) {
        // Non-browser or localStorage error: use a global fallback with random init
        const g = globalThis as any;
        if (typeof g.__GEMINI_ROTATION_INDEX !== 'number') {
          const randomStart = Math.floor(Math.random() * n);
          g.__GEMINI_ROTATION_INDEX = (randomStart + 1) % n;
          return randomStart;
        }
        const start = g.__GEMINI_ROTATION_INDEX % n;
        g.__GEMINI_ROTATION_INDEX = (g.__GEMINI_ROTATION_INDEX + 1) % n;
        return start;
      }
    }

    const keys = getGeminiKeys();
    if (!keys || keys.length === 0) {
      console.error("Gemini API key(s) not configured");
      return "AI feature not configured. Please check the environment variables.";
    }

    // Enhanced prompt with better context and instructions
    const prompt = `You are an AI assistant for Harsh Upadhyay's portfolio website. You have access to Harsh's complete profile and should provide helpful, accurate responses to visitors' questions. Consider the following detailed information:
${RESUME_CONTEXT}

Question: ${query}
Instructions for providing responses:
1. Voice and Tone:
   - Answer in Harsh's voice (first person)
   - Be confident but humble
2. Content Guidelines:
   - Provide specific, data-backed information when available
   - Highlight achievements and metrics that support your answer
3. Response Structure:
  - Prefer concise answers, but always finish sentences and include proper punctuation. Do not truncate important details. And DON'T Exceed 2 lines in response.
  - Keep the response as condensed as possible while ensuring clarity and completeness.
  - Start with the most relevant information
5. Always:
   - Stay within the scope of the provided information
   - Maintain consistency with the portfolio website
Remember: You are representing a professional developer's portfolio. Your responses should reflect technical expertise while remaining accessible to all visitors.`;

    // Try each configured key in round-robin order. We consume a start index so
    // each call prefers a different primary key and will retry with others.
    const start = consumeStartIndex(keys.length);
    let lastErrorText: string | null = null;
    let data: GeminiResponse | null = null;
    let ok = false;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const key = keys[(start + attempt) % keys.length];
      try {
        const resp = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                topP: 0.6,
                topK: 30,
              },
            }),
          }
        );

        if (!resp.ok) {
          const txt = await resp.text();
          lastErrorText = `status=${resp.status} body=${txt}`;
          // try the next key
          continue;
        }

        data = await resp.json();
        ok = true;
        break;
      } catch (err: any) {
        lastErrorText = String(err?.message || err);
        // try next key
        continue;
      }
    }

    if (!ok || !data) {
      console.error("All Gemini keys failed", lastErrorText);
      const fallback = getFallbackResponse(query);
      if (fallback) return fallback;
      return `I apologize, but I'm having trouble processing your query at the moment. Please try again or rephrase your question.`;
    }

    

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Validate and clean up the response
    if (!text || text.length < 10) {
      console.warn("Empty or very short response from API");
      const fallback = getFallbackResponse(query);
      if (fallback) {
        return fallback;
      }
      return "I'm sorry, but I couldn't generate a meaningful response. Please try rephrasing your question.";
    }

    return text;
  } catch (error) {
    console.error("Error in queryAI:", error);
    
    // Try to get a fallback response
    const fallback = getFallbackResponse(query);
    if (fallback) {
      return fallback;
    }
    
    return "I apologize, but I'm having trouble processing your request. Please try again in a moment.";
  }
}

export function isHardcodedQuery(query: string): boolean {
  const hardcodedKeywords = [
    // Navigation
    "projects",
    "contact",
    "resume",
    "theme",
    "cv",
    "github",
    "linkedin"
  ];

  const lowerQuery = query.toLowerCase().trim();
  
  // Check if query starts with or matches any hardcoded keyword (prefix matching)
  return hardcodedKeywords.some((keyword) =>
    keyword.startsWith(lowerQuery) || lowerQuery.startsWith(keyword)
  );
}
