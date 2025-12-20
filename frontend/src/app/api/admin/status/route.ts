import { NextRequest, NextResponse } from "next/server";

interface ServiceStatus {
    name: string;
    url: string;
    status: "online" | "offline" | "error";
    latency: number;
    lastCheck: string;
    details?: Record<string, unknown>;
    error?: string;
}

const SERVICES = [
    {
        name: "Supabase REST API",
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://64.177.81.23:8000",
        type: "rest",
        testEndpoint: "/rest/v1/"
    },
    {
        name: "Supabase Studio",
        url: "http://64.177.81.23:3001",
        type: "http"
    },
    {
        name: "n8n Workflows",
        url: "http://216.238.70.204:5678",
        type: "http"
    },
    {
        name: "VPS Panel",
        url: "http://216.238.70.204:3005",
        type: "http"
    },
    {
        name: "Groq API",
        url: "https://api.groq.com/openai",
        type: "api",
        requiresAuth: true
    },
    {
        name: "SambaNova API",
        url: "https://api.sambanova.ai/v1",
        type: "api",
        requiresAuth: true
    }
];

async function checkService(service: typeof SERVICES[0]): Promise<ServiceStatus> {
    const startTime = Date.now();

    try {
        const url = service.type === "rest"
            ? `${service.url}${service.testEndpoint || ""}`
            : service.url;

        const headers: Record<string, string> = {};

        if (service.type === "rest") {
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";
            headers["apikey"] = supabaseKey;
            headers["Authorization"] = `Bearer ${supabaseKey}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers,
            signal: AbortSignal.timeout(10000)
        });

        const latency = Date.now() - startTime;

        return {
            name: service.name,
            url: service.url,
            status: response.ok || response.status < 500 ? "online" : "error",
            latency,
            lastCheck: new Date().toISOString(),
            details: {
                statusCode: response.status,
                statusText: response.statusText
            }
        };
    } catch (error) {
        return {
            name: service.name,
            url: service.url,
            status: "offline",
            latency: Date.now() - startTime,
            lastCheck: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

export async function GET() {
    try {
        const statusPromises = SERVICES.map(checkService);
        const results = await Promise.all(statusPromises);

        const summary = {
            total: results.length,
            online: results.filter(r => r.status === "online").length,
            offline: results.filter(r => r.status === "offline").length,
            error: results.filter(r => r.status === "error").length,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            summary,
            services: results
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// POST: Execute actions on services
export async function POST(request: NextRequest) {
    try {
        const { action, service, data } = await request.json();

        async function testSupabaseInsert(data: { tema: string; contenido: string }) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://64.177.81.23:8000";
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/clases_generadas`, {
                    method: "POST",
                    headers: {
                        "apikey": supabaseKey,
                        "Authorization": `Bearer ${supabaseKey}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=representation"
                    },
                    body: JSON.stringify({
                        tema: data.tema || "Test Insert",
                        contenido: data.contenido || "This is a test insert from Admin Panel",
                        modelo: "Admin Test",
                        tokens_usados: 0
                    })
                });

                const result = await response.json();

                return NextResponse.json({
                    success: response.ok,
                    statusCode: response.status,
                    result
                });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        async function testGroqAPI(data: { message: string }) {
            const groqKey = process.env.GROQ_API_KEY;

            if (!groqKey) {
                return NextResponse.json({
                    success: false,
                    error: "GROQ_API_KEY not configured"
                });
            }

            try {
                const startTime = Date.now();
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [{ role: "user", content: data.message || "Hello" }],
                        max_tokens: 50
                    })
                });

                const result = await response.json();
                const latency = Date.now() - startTime;

                return NextResponse.json({
                    success: response.ok,
                    latency,
                    result
                });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        async function getSupabaseStats() {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://64.177.81.23:8000";
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/clases_generadas?select=count`, {
                    method: "GET",
                    headers: {
                        "apikey": supabaseKey,
                        "Authorization": `Bearer ${supabaseKey}`,
                        "Prefer": "count=exact"
                    }
                });

                const count = response.headers.get("content-range")?.split("/")[1] || "0";

                return NextResponse.json({
                    success: true,
                    stats: {
                        totalClases: parseInt(count),
                        lastUpdated: new Date().toISOString()
                    }
                });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }
