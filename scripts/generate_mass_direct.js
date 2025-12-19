const https = require('https');
const http = require('http');

// Configuration
const SAMBANOVA_API_KEY = "9f65a91b-2277-4255-81ae-2b62ba0299bd";
const SUPABASE_HOST = "64.177.81.23";
const SUPABASE_PORT = 8000;
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

const TOPICS = {
    "Lectura y Escritura": [
        "Las vocales y sus sonidos", "El abecedario completo", "Sílabas simples", "Formando palabras cortas",
        "Uso de mayúsculas", "Signos de puntuación", "Comprensión lectora básica", "Escribiendo datos personales",
        "Tipos de textos: receta", "Sinónimos y antónimos", "Verbos: tiempos simples", "Adjetivos y descripciones",
        "La oración simple", "Reglas de acentuación", "Escribiendo una carta"
    ],
    "Ciencias Naturales": [
        "Los cinco sentidos", "El sistema digestivo", "El sistema respiratorio", "El sistema solar",
        "Ciclo del agua", "Las plantas y sus partes", "Animales vertebrados e invertebrados",
        "Salud e higiene personal", "Ecosistemas de México", "Cuidado del medio ambiente (3R)",
        "La energía eléctrica", "Fenómenos naturales"
    ],
    "Ciencias Sociales": [
        "Historia de la Independencia", "La Revolución Mexicana", "La Constitución y derechos",
        "Geografía de México", "Diversidad cultural", "Tradiciones: Día de Muertos",
        "Familia y comunidad", "Derechos de los niños", "La democracia",
        "Símbolos patrios", "Culturas prehispánicas", "Economía familiar"
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
                        resolve(data); // In case it's not JSON
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
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
    console.log(`[Generating] ${category}: ${topic}...`);
    const startTime = Date.now();

    try {
        // 1. Generate Content with SambaNova (HTTPS)
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
                    content: `Eres un educador experto del programa INEA México. Crea lecciones claras y prácticas para adultos.
                    Genera en Markdown: Título, Objetivos, Contenido explicativo detallado, Ejemplos de la vida diaria mexicana, y un Quiz de 3 preguntas.`
                },
                {
                    role: "user",
                    content: `Crea una clase educativa completa sobre: ${topic}`
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        }, true);

        const content = aiData.choices[0].message.content;
        const tokens = aiData.usage.total_tokens;

        // 2. Insert into Supabase (HTTP)
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
        }, false); // False for HTTP

        const id = Array.isArray(insertData) ? insertData[0].id : insertData?.id;
        console.log(`   ✅ Success! ID: ${id} | Tokens: ${tokens} | ${Date.now() - startTime}ms`);
        return true;

    } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        return false;
    }
}

async function runBatch() {
    console.log("🚀 Starting Mass Content Generation (Mixed Protocol)");
    console.log("==================================================");

    let totalSuccess = 0;
    let totalFailed = 0;

    for (const [category, topics] of Object.entries(TOPICS)) {
        console.log(`\n📂 Category: ${category}`);
        for (const topic of topics) {
            const success = await generateClass(topic, category);
            if (success) totalSuccess++;
            else totalFailed++;

            // Rate limiting - wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log("\n===================================================");
    console.log(`🎉 Finished! Total: ${totalSuccess + totalFailed} | Success: ${totalSuccess} | Failed: ${totalFailed}`);
}

runBatch();
