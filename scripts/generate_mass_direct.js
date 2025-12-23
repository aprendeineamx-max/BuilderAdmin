const https = require('https');
const http = require('http');

// Configuration
const SAMBANOVA_API_KEY = "9f65a91b-2277-4255-81ae-2b62ba0299bd";
const SUPABASE_HOST = "localhost";
const SUPABASE_PORT = 8000;
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

const TOPICS = {
    "Matemáticas": [
        "Suma y Resta Básica", "Multiplicación para la vida", "Fracciones en el mercado",
        "Cálculo de Áreas simples", "Porcentajes y Descuentos", "Uso del Dinero",
        "Geometría básica", "Lectura de Gráficas", "Unidades de Medida"
    ],
    "Lectura": [
        "Las vocales y sus sonidos", "El abecedario completo", "Sílabas simples", "Formando palabras cortas",
        "Uso de mayúsculas", "Signos de puntuación", "Comprensión lectora básica", "Escribiendo datos personales",
        "Tipos de textos: receta", "Sinónimos y antónimos", "Redacción de cartas formales"
    ],
    "Ciencias": [
        "Los cinco sentidos", "El sistema digestivo", "Cuidado del Agua", "Las Plantas Medicinales",
        "Nutrición y Salud", "Prevención de Enfermedades", "El Clima de México"
    ],
    "Sociedad": [
        "Historia de la Independencia", "La Revolución Mexicana", "Derechos y Obligaciones",
        "Geografía de México", "Tradiciones Mexicanas", "Economía Familiar"
    ]
};

function request(options, body, useHttps = true) {
    return new Promise((resolve, reject) => {
        const lib = useHttps ? https : http;
        const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    resolve({ error: `Status ${res.statusCode}: ${data}` }); // Resolve error
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function generateClass(topic, category) {
    console.log(`[Generando] ${category}: ${topic}...`);
    const startTime = Date.now();

    try {
        // 1. Generate via SambaNova (Llama 3.3)
        const aiData = await request({
            hostname: 'api.sambanova.ai',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${SAMBANOVA_API_KEY}`,
                "Content-Type": "application/json"
            }
        }, {
            model: "Meta-Llama-3.3-70B-Instruct",
            messages: [
                {
                    role: "system",
                    content: `Eres un educador profesional del INEA. Genera una clase completa en formato Markdown puro.
                    Incluye: # Título, ## Introducción, ## Desarrollo (con ejemplos mexicanos), ## Ejercicios.
                    No uses JSON, solo Markdown.`
                },
                {
                    role: "user",
                    content: `Crea una clase educativa completa sobre: ${topic} (${category})`
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        }, true);

        if (aiData.error) throw new Error(aiData.error);
        if (!aiData.choices || aiData.choices.length === 0) throw new Error("No Content from AI");

        const content = aiData.choices[0].message.content;
        const tokens = aiData.usage.total_tokens;

        // 2. Insert into Supabase
        const insertData = await request({
            hostname: SUPABASE_HOST,
            port: SUPABASE_PORT,
            path: '/rest/v1/clases_generadas',
            method: 'POST',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
        }, {
            tema: topic,
            contenido: content,
            modelo: "Meta-Llama-3.3-70B-Instruct",
            tokens_usados: tokens
        }, false);

        if (insertData.error) throw new Error(JSON.stringify(insertData));

        const id = Array.isArray(insertData) ? insertData[0].id : insertData?.id;
        console.log(`   ✅ Guardado! ID: ${id} | Tokens: ${tokens} | ${Date.now() - startTime}ms`);
        return true;

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
    }
}

async function runBatch() {
    console.log("🚀 Iniciando Generación Masiva (SambaNova Llama 3.3)");
    console.log("==================================================");

    let totalSuccess = 0;

    for (const [category, topics] of Object.entries(TOPICS)) {
        console.log(`\n📂 Categoría: ${category}`);
        for (const topic of topics) {
            const success = await generateClass(topic, category);
            if (success) totalSuccess++;
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log("\n===================================================");
    console.log(`🎉 Terminado! Total Generado: ${totalSuccess}`);
}

runBatch();
