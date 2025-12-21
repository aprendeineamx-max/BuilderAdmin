/**
 * INEA.mx Chat Tutor API
 * Uses Groq API for ultra-fast responses (<500ms)
 * 
 * Endpoint: POST /api/tutor/chat
 * 
 * Run: node chat_tutor_api.js
 * Listens on: http://localhost:3002/api/tutor/chat
 */

const http = require('http');
const https = require('https');

// Configuration
const PORT = 3002;
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Fast and high quality

// System prompt for the tutor
const TUTOR_SYSTEM_PROMPT = `Eres "Profe INEA", un tutor virtual amable y paciente del Instituto Nacional para la Educación de los Adultos (INEA) en México.

Tu rol:
- Ayudar a adultos que están aprendiendo educación básica
- Explicar conceptos de manera simple y clara
- Usar ejemplos de la vida cotidiana mexicana
- Ser motivador y nunca hacer sentir mal al estudiante
- Responder en español

Reglas:
- Respuestas cortas y claras (máximo 3 párrafos)
- Si no entiendes la pregunta, pide aclaración amablemente
- Usa emojis ocasionalmente para ser más amigable
- Siempre termina con una pregunta o invitación a seguir aprendiendo

Temas que puedes enseñar:
- Matemáticas: sumas, restas, multiplicación, división, fracciones, porcentajes
- Lectura: comprensión lectora, vocabulario, redacción
- Ciencias: naturaleza, salud, medio ambiente
- Sociedad: historia de México, geografía, civismo`;

/**
 * Call Groq API
 */
async function callGroq(messages, model = GROQ_MODEL) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
            stream: false
        });

        const options = {
            hostname: 'api.groq.com',
            port: 443,
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const startTime = Date.now();

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                const latency = Date.now() - startTime;
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({
                        content: parsed.choices[0].message.content,
                        tokens: parsed.usage?.total_tokens || 0,
                        latency_ms: latency,
                        model: GROQ_MODEL
                    });
                } catch (e) {
                    reject(new Error('Failed to parse Groq response: ' + responseData));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Handle CORS
 */
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Main server handler
 */
async function handleRequest(req, res) {
    setCORSHeaders(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Only accept POST to /api/tutor/chat
    if (req.method !== 'POST' || req.url !== '/api/tutor/chat') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found. Use POST /api/tutor/chat' }));
        return;
    }

    // Read body
    let body = '';
    for await (const chunk of req) {
        body += chunk;
    }

    try {
        const { message, lesson_context, history, image_url } = JSON.parse(body);

        if (!message && !image_url) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing "message" or "image_url" field' }));
            return;
        }

        // Determine Model
        // Use Vision model if image is present, otherwise standard fast model
        const currentModel = image_url ? 'llama-3.2-90b-vision-preview' : GROQ_MODEL;

        // Build messages array
        const messages = [
            { role: 'system', content: TUTOR_SYSTEM_PROMPT }
        ];

        // Add lesson context if provided
        if (lesson_context) {
            messages.push({
                role: 'system',
                content: `El estudiante está en la lección: "${lesson_context}". Enfócate en ese tema.`
            });
        }

        // Add conversation history if provided (only for text context, vision usually serves as single turn or needs complex handling)
        if (history && Array.isArray(history)) {
            // Filter out complex content from history if needed, for now assuming text history
            messages.push(...history.slice(-6));
        }

        // Add current message with Image if present
        if (image_url) {
            messages.push({
                role: 'user',
                content: [
                    { type: "text", text: message || "Analiza esta imagen y ayuda al estudiante:" },
                    { type: "image_url", image_url: { url: image_url } }
                ]
            });
        } else {
            messages.push({ role: 'user', content: message });
        }

        // Call Groq (Modified call to support dynamic model)
        // We need to modify callGroq to accept model
        const response = await callGroq(messages, currentModel);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            response: response.content,
            tokens_used: response.tokens,
            latency_ms: response.latency_ms,
            model: response.model
        }));

    } catch (error) {
        console.error('Error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

// Create server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`🎓 INEA Chat Tutor API running on http://localhost:${PORT}`);
    console.log(`📡 Endpoint: POST /api/tutor/chat`);
    console.log(`⚡ Using Groq with ${GROQ_MODEL}`);
    console.log(`\nExample request:`);
    console.log(`curl -X POST http://localhost:${PORT}/api/tutor/chat \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"message":"¿Cómo sumo fracciones?", "lesson_context":"fracciones"}'`);
});
