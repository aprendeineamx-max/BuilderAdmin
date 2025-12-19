import { NextRequest, NextResponse } from "next/server";

const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY || "9f65a91b-2277-4255-81ae-2b62ba0299bd";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://64.177.81.23:8000";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

export async function POST(request: NextRequest) {
    try {
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // Generate class content with SambaNova
        const startTime = Date.now();

        const aiResponse = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${SAMBANOVA_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.3-70B-Instruct",
                messages: [
                    {
                        role: "system",
                        content: `Eres un educador experto del programa INEA México. Crea lecciones claras y prácticas para adultos en educación básica.

Formato requerido:
# [Título de la Clase]

## Objetivos
1. [Objetivo 1]
2. [Objetivo 2]
3. [Objetivo 3]

## Contenido

[Explicación paso a paso con ejemplos de la vida cotidiana mexicana]

## Ejemplos Prácticos

### Ejemplo 1
[Ejemplo con situación real]

### Ejemplo 2
[Ejemplo con situación real]

## Quiz de Autoevaluación

**Pregunta 1:** [Pregunta]
- a) [Opción]
- b) [Opción]
- c) [Opción]
- d) [Opción]

**Respuesta correcta:** [Letra]

[Repetir para 3 preguntas]`
                    },
                    {
                        role: "user",
                        content: `Crea una clase educativa sobre: ${topic}`
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!aiResponse.ok) {
            const error = await aiResponse.text();
            return NextResponse.json({
                success: false,
                error: `AI API Error: ${aiResponse.status} - ${error}`
            }, { status: 500 });
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices[0]?.message?.content || "";
        const tokens = aiData.usage?.total_tokens || 0;
        const generationTime = Date.now() - startTime;

        // Insert into Supabase
        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/clases_generadas`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                tema: topic,
                contenido: content,
                modelo: "Meta-Llama-3.3-70B-Instruct",
                tokens_usados: tokens
            })
        });

        let insertedData = null;
        let insertError = null;

        if (insertResponse.ok) {
            insertedData = await insertResponse.json();
        } else {
            insertError = await insertResponse.text();
        }

        return NextResponse.json({
            success: insertResponse.ok,
            generationTime,
            tokens,
            contentLength: content.length,
            preview: content.substring(0, 500) + "...",
            insertedId: insertedData?.[0]?.id,
            insertError: insertError ? JSON.parse(insertError) : null
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// GET: Fetch all classes
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") || "50";

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/clases_generadas?select=id,tema,tokens_usados,created_at&order=id.desc&limit=${limit}`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            count: data.length,
            classes: data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
