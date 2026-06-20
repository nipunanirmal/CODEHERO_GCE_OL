/**
 * aiErrorExplainer.js
 * Reads AI config from localStorage and calls the configured provider
 * to explain Pascal runtime errors in simple English/Singlish.
 */

const CONFIG_KEY = 'codehero_ai_config';

const SYSTEM_PROMPT = `You are a helpful Pascal programming tutor for Sri Lankan students learning GCE O/L ICT.
You will receive a Pascal error message and the full code. Your job is to identify EXACTLY what is wrong.
IMPORTANT RULES:
- The error message will tell you the EXACT line number. Focus ONLY on that specific line.
- Do NOT guess or make up a different reason. Read the error carefully and match it with the code.
- If the error says "Expecting X, got Y", logically figure out what punctuation or keyword is missing.
  - Example: If it says "got 'EOF'" near the final 'end', it means the program is missing the final '.' after 'end'.
  - Example: If it says "got 'ELSE'" and there is a semicolon (;) on the line before the 'else', it means they accidentally put a semicolon before 'else' which terminates the 'if' statement early! In Pascal, there should be NO semicolon right before 'else'.
- Explain the real cause in 2-3 short, simple sentences using simple English or singlish (sinhala by english words).
- Be friendly and encouraging.
- Do NOT give the fixed code. Just explain the cause simply.`;

/**
 * Load AI config from localStorage.
 * @returns {{ provider: 'groq'|'ollama', apiKey?: string, model?: string, baseUrl?: string } | null}
 */
export function getAIConfig() {
    try {
        const raw = localStorage.getItem(CONFIG_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Save AI config to localStorage.
 * @param {{ provider: 'groq'|'ollama', apiKey?: string, model?: string, baseUrl?: string }} config
 */
export function saveAIConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * Explain a Pascal error using the configured AI provider.
 * @param {string} errorMessage - The error message (e.g. "[ERROR]: Division by zero")
 * @param {string} code - The Pascal source code that caused the error
 * @returns {Promise<string>} - A simple explanation string
 */
export async function explainError(errorMessage, code) {
    const config = getAIConfig();

    if (!config) {
        return '⚠️ AI provider configured නෑ. Admin panel (/admin) ගිහිල්ලා configure කරන්න.';
    }

    // Extract the error line number from the message (e.g. "Parse error on line 13:")
    const lineNumMatch = errorMessage.match(/line (\d+)/i);
    const errorLineNum = lineNumMatch ? parseInt(lineNumMatch[1], 10) : null;

    // Extract the specific problematic line from the code to give the AI laser focus
    const codeLines = code.split('\n');
    let specificLineInfo = '';
    if (errorLineNum && errorLineNum <= codeLines.length) {
        // Show the error line and 1 line before for context
        const start = Math.max(0, errorLineNum - 2);
        const end = errorLineNum;
        const contextLines = codeLines.slice(start, end)
            .map((l, i) => `Line ${start + i + 1}: ${l}`)
            .join('\n');
        specificLineInfo = `\n\nThe error is near line ${errorLineNum}. Here is the relevant code:\n${contextLines}`;
    }

    const userMessage = `Pascal Error: ${errorMessage}${specificLineInfo}\n\nFull Code:\n${code}\n\nExplain EXACTLY why this error happened, focusing on the line number mentioned in the error.`;

    if (config.provider === 'groq') {
        return await callGroq(config.apiKey, userMessage);
    } else if (config.provider === 'ollama') {
        return await callOllama(config.baseUrl || 'http://localhost:11434', config.model || 'qwen2.5:0.5b', userMessage);
    }

    return '⚠️ Unknown AI provider configured.';
}

async function callGroq(apiKey, userMessage) {
    if (!apiKey) throw new Error('Groq API key not set.');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage },
            ],
            max_tokens: 200,
            temperature: 0.4,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'No explanation received.';
}

async function callOllama(baseUrl, model, userMessage) {
    const cleanBase = baseUrl.replace(/\/$/, '');

    const response = await fetch(`${cleanBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage },
            ],
            stream: false,
            options: { num_predict: 200 },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}. Is Ollama running at ${baseUrl}?`);
    }

    const data = await response.json();
    return data.message?.content?.trim() || 'No explanation received.';
}
