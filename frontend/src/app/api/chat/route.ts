import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = "llama-3.3-70b-versatile";

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
- Siempre termina con una pregunta o invitación a seguir aprendiendo`;

export async function POST(request: NextRequest) {
    try {
        const { message, lesson_context, history } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Missing message" }, { status: 400 });
        }

        // Build messages
        const messages = [
            { role: "system", content: TUTOR_SYSTEM_PROMPT }
        ];

        if (lesson_context && lesson_context !== "general") {
            messages.push({
                role: "system",
                content: `El estudiante está en la lección: "${lesson_context}". Enfócate en ese tema.`
            });
        }

        if (history && Array.isArray(history)) {
            messages.push(...history.slice(-6));
        }

        messages.push({ role: "user", content: message });

        // Call Groq API
        const startTime = Date.now();
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        const latency = Date.now() - startTime;

        if (data.error) {
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            response: data.choices[0].message.content,
            tokens_used: data.usage?.total_tokens || 0,
            latency_ms: latency,
            model: GROQ_MODEL
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
