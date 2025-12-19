"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ServiceStatus {
    name: string;
    url: string;
    status: "online" | "offline" | "error";
    latency: number;
    lastCheck: string;
    details?: Record<string, unknown>;
    error?: string;
}

interface StatusSummary {
    total: number;
    online: number;
    offline: number;
    error: number;
    timestamp: string;
}

interface SupabaseStats {
    totalClases: number;
    lastUpdated: string;
}

function BatchButton({ title, topics, onLog, onStatsUpdate }: {
    title: string,
    topics: string[],
    onLog: (msg: string) => void,
    onStatsUpdate: () => void
}) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const runBatch = async () => {
        if (!confirm(`¿Iniciar la generación de ${topics.length} clases? Esto tomará varios minutos.`)) return;

        setLoading(true);
        setProgress(0);

        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            onLog(`[${i + 1}/${topics.length}] Generando: ${topic}...\n`);

            try {
                const response = await fetch("/api/admin/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic })
                });
                const data = await response.json();

                if (data.success) {
                    onLog(`✅ OK! ID: ${data.insertedId}\n`);
                } else {
                    onLog(`❌ Error: ${JSON.stringify(data.error)}\n`);
                }
            } catch (e) {
                onLog(`❌ Error Red: ${e}\n`);
            }

            setProgress(i + 1);
            onStatsUpdate();
            // Small delay to be nice to APIs
            await new Promise(r => setTimeout(r, 1000));
        }

        setLoading(false);
        onLog(`✨ Batch "${title}" completado!\n\n`);
        alert(`Batch completado: ${title}`);
    };

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-white">{title}</h4>
                <span className="text-xs text-gray-400">{topics.length} temas</span>
            </div>

            {loading && (
                <div className="w-full bg-slate-700 h-2 rounded-full mb-3 overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${(progress / topics.length) * 100}%` }}
                    />
                </div>
            )}

            <button
                onClick={runBatch}
                disabled={loading}
                className="w-full py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
                {loading ? `Generando (${progress}/${topics.length})...` : "▶ Iniciar Batch"}
            </button>
        </div>
    );
}

export default function AdminPage() {
    const [services, setServices] = useState<ServiceStatus[]>([]);
    const [summary, setSummary] = useState<StatusSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [supabaseStats, setSupabaseStats] = useState<SupabaseStats | null>(null);
    const [testOutput, setTestOutput] = useState<string>("");
    const [testLoading, setTestLoading] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/status");
            const data = await response.json();

            if (data.success) {
                setServices(data.services);
                setSummary(data.summary);
            }
        } catch (error) {
            console.error("Error fetching status:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSupabaseStats = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "get_supabase_stats" })
            });
            const data = await response.json();
            if (data.success) {
                setSupabaseStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching Supabase stats:", error);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        fetchSupabaseStats();

        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchStatus();
                fetchSupabaseStats();
            }, 10000); // Refresh every 10 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh, fetchStatus, fetchSupabaseStats]);

    const testSupabaseInsert = async () => {
        setTestLoading(true);
        setTestOutput("Testing Supabase insert...\n");

        try {
            const response = await fetch("/api/admin/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "test_supabase_insert",
                    data: {
                        tema: "Test desde Admin Panel",
                        contenido: `# Test Class\n\nThis is a test insert from the Admin Panel.\nTimestamp: ${new Date().toISOString()}`
                    }
                })
            });
            const data = await response.json();
            setTestOutput(prev => prev + JSON.stringify(data, null, 2));
            fetchSupabaseStats();
        } catch (error) {
            setTestOutput(prev => prev + `Error: ${error}`);
        } finally {
            setTestLoading(false);
        }
    };

    const testGroqAPI = async () => {
        setTestLoading(true);
        setTestOutput("Testing Groq API...\n");

        try {
            const response = await fetch("/api/admin/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "test_groq",
                    data: { message: "Say 'Hello from Admin Panel!' in Spanish" }
                })
            });
            const data = await response.json();
            setTestOutput(prev => prev + JSON.stringify(data, null, 2));
        } catch (error) {
            setTestOutput(prev => prev + `Error: ${error}`);
        } finally {
            setTestLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-emerald-500";
            case "offline": return "bg-red-500";
            case "error": return "bg-amber-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "online": return "bg-emerald-500/10 border-emerald-500/30";
            case "offline": return "bg-red-500/10 border-red-500/30";
            case "error": return "bg-amber-500/10 border-amber-500/30";
            default: return "bg-gray-500/10 border-gray-500/30";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">I</span>
                                </div>
                                <span className="text-white font-bold text-xl">INEA.mx</span>
                            </Link>
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">ADMIN</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="w-4 h-4 rounded"
                                />
                                Auto-refresh (10s)
                            </label>
                            <button
                                onClick={fetchStatus}
                                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🖥️ Panel de Administración</h1>
                    <p className="text-gray-400">Monitoreo en tiempo real de todos los servicios externos</p>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-3xl font-bold text-white">{summary.total}</div>
                            <div className="text-gray-400 text-sm">Servicios Totales</div>
                        </div>
                        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                            <div className="text-3xl font-bold text-emerald-400">{summary.online}</div>
                            <div className="text-gray-400 text-sm">En Línea</div>
                        </div>
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                            <div className="text-3xl font-bold text-red-400">{summary.offline}</div>
                            <div className="text-gray-400 text-sm">Fuera de Línea</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                            <div className="text-3xl font-bold text-amber-400">{summary.error}</div>
                            <div className="text-gray-400 text-sm">Con Errores</div>
                        </div>
                    </div>
                )}

                {/* Services Grid */}
                <h2 className="text-xl font-semibold text-white mb-4">📡 Estado de Servicios</h2>
                {loading ? (
                    <div className="text-gray-400">Cargando servicios...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`rounded-xl p-4 border ${getStatusBg(service.status)}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} animate-pulse`} />
                                        <span className="text-white font-medium">{service.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{service.latency}ms</span>
                                </div>
                                <div className="text-gray-400 text-sm truncate mb-2">{service.url}</div>
                                {service.error && (
                                    <div className="text-red-400 text-xs bg-red-500/10 rounded p-2 mt-2">
                                        {service.error}
                                    </div>
                                )}
                                {service.details && (
                                    <div className="text-gray-500 text-xs mt-2">
                                        Status: {String(service.details.statusCode)} {String(service.details.statusText)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Supabase Stats & Tools */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Supabase Stats */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">📊 Supabase Stats</h3>
                        {supabaseStats ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-gray-400">Total Clases</span>
                                    <span className="text-2xl font-bold text-blue-400">{supabaseStats.totalClases}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-gray-400">Última actualización</span>
                                    <span className="text-sm text-gray-300">
                                        {new Date(supabaseStats.lastUpdated).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400">Cargando stats...</div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">⚡ Acciones Rápidas</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={testSupabaseInsert}
                                disabled={testLoading}
                                className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 text-sm"
                            >
                                🔧 Test Supabase Insert
                            </button>
                            <button
                                onClick={testGroqAPI}
                                disabled={testLoading}
                                className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 text-sm"
                            >
                                🤖 Test Groq API
                            </button>
                            <a
                                href="http://64.177.81.23:3001"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 text-sm text-center"
                            >
                                📊 Supabase Studio
                            </a>
                            <a
                                href="http://216.238.70.204:5678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 text-sm text-center"
                            >
                                🔄 n8n Workflows
                            </a>
                        </div>
                    </div>
                </div>

                {/* Content Generator */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">✨ Generador de Contenido IA</h3>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Tema de la clase (ej. La Revolución Mexicana)"
                            className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:border-blue-500"
                            id="topic-input"
                        />
                        <button
                            onClick={async () => {
                                const input = document.getElementById("topic-input") as HTMLInputElement;
                                const topic = input.value;
                                if (!topic) return;

                                setTestLoading(true);
                                setTestOutput(`Generando clase sobre: ${topic}...\n`);

                                try {
                                    const response = await fetch("/api/admin/generate", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ topic })
                                    });
                                    const data = await response.json();

                                    if (data.success) {
                                        setTestOutput(prev => prev + `✅ Clase creada exitosamente!\nID: ${data.insertedId}\nTokens: ${data.tokens}\nTiempo: ${data.generationTime}ms\n\n`);
                                        fetchSupabaseStats();
                                        input.value = "";
                                    } else {
                                        setTestOutput(prev => prev + `❌ Error: ${JSON.stringify(data.error || data.insertError, null, 2)}\n\n`);
                                    }
                                } catch (error) {
                                    setTestOutput(prev => prev + `❌ Error de red: ${error}\n\n`);
                                } finally {
                                    setTestLoading(false);
                                }
                            }}
                            disabled={testLoading}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                        >
                            Generar Clase
                        </button>
                    </div>
                    <p className="text-sm text-gray-400">
                        Usa el modelo <strong>Llama 3.3 70B</strong> (SambaNova) para generar contenido y lo guarda automáticamente en Supabase.
                    </p>
                </div>

                {/* Batch Content Generator */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">🚀 Generación Masiva (Batch)</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Genera módulos completos automáticamente. Asegúrate de monitorear el progreso.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BatchButton
                            title="📚 Lectura y Escritura (15 clases)"
                            topics={[
                                "Las vocales y sus sonidos", "El abecedario completo", "Sílabas simples", "Formando palabras cortas",
                                "Uso de mayúsculas", "Signos de puntuación", "Comprensión lectora básica", "Escribiendo datos personales",
                                "Tipos de textos: receta", "Sinónimos y antónimos", "Verbos: tiempos simples", "Adjetivos y descripciones",
                                "La oración simple", "Reglas de acentuación", "Escribiendo una carta"
                            ]}
                            onLog={(msg) => setTestOutput(prev => msg + prev)}
                            onStatsUpdate={fetchSupabaseStats}
                        />

                        <BatchButton
                            title="🧪 Ciencias Naturales (12 clases)"
                            topics={[
                                "Los cinco sentidos", "El sistema digestivo", "El sistema respiratorio", "El sistema solar",
                                "Ciclo del agua", "Las plantas y sus partes", "Animales vertebrados e invertebrados",
                                "Salud e higiene personal", "Ecosistemas de México", "Cuidado del medio ambiente (3R)",
                                "La energía eléctrica", "Fenómenos naturales"
                            ]}
                            onLog={(msg) => setTestOutput(prev => msg + prev)}
                            onStatsUpdate={fetchSupabaseStats}
                        />

                        <BatchButton
                            title="🌎 Ciencias Sociales (12 clases)"
                            topics={[
                                "Historia de la Independencia", "La Revolución Mexicana", "La Constitución y derechos",
                                "Geografía de México", "Diversidad cultural", "Tradiciones: Día de Muertos",
                                "Familia y comunidad", "Derechos de los niños", "La democracia",
                                "Símbolos patrios", "Culturas prehispánicas", "Economía familiar"
                            ]}
                            onLog={(msg) => setTestOutput(prev => msg + prev)}
                            onStatsUpdate={fetchSupabaseStats}
                        />

                        <BatchButton
                            title="📐 Matemáticas (Faltantes)"
                            topics={[
                                "Fracciones: conceptos básicos", "Suma de fracciones", "Resta de fracciones",
                                "Porcentajes: concepto", "Cálculo de porcentajes", "Geometría: Cuadrado y Rectángulo",
                                "Geometría: Triángulo", "Perímetro básico", "Área básica",
                                "Unidades de medida", "Unidades de peso", "Unidades de tiempo"
                            ]}
                            onLog={(msg) => setTestOutput(prev => msg + prev)}
                            onStatsUpdate={fetchSupabaseStats}
                        />
                    </div>
                </div>

                {/* Debug Console */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">🖥️ Consola de Debug</h3>
                        <button
                            onClick={() => setTestOutput("")}
                            className="text-sm text-gray-400 hover:text-white"
                        >
                            Limpiar
                        </button>
                    </div>
                    <pre className="bg-slate-900 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-auto max-h-64 min-h-32">
                        {testOutput || "// Los resultados de las pruebas aparecerán aquí..."}
                    </pre>
                </div>

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/10">
                        <span className="text-2xl block mb-2">📊</span>
                        <span className="text-gray-300">Dashboard</span>
                    </Link>
                    <Link href="/cursos" className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/10">
                        <span className="text-2xl block mb-2">📚</span>
                        <span className="text-gray-300">Cursos</span>
                    </Link>
                    <Link href="/chat" className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/10">
                        <span className="text-2xl block mb-2">🤖</span>
                        <span className="text-gray-300">Chat Tutor</span>
                    </Link>
                    <a href="http://216.238.70.204:3005" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/10">
                        <span className="text-2xl block mb-2">🖥️</span>
                        <span className="text-gray-300">VPS Panel</span>
                    </a>
                </div>

                {/* Last Updated */}
                {summary && (
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        Última actualización: {new Date(summary.timestamp).toLocaleString()}
                    </div>
                )}
            </main>
        </div>
    );
}
