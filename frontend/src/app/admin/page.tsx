"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell
} from 'recharts';

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

interface AnalyticsData {
    total_users: number;
    total_classes: number;
    total_completions: number;
    registrations_chart: { date: string, count: number }[];
    top_users: { nombre: string, email: string, completed: number }[];
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
    const [activeTab, setActiveTab] = useState<'monitor' | 'analytics'>('monitor');

    // Status State
    const [services, setServices] = useState<ServiceStatus[]>([]);
    const [summary, setSummary] = useState<StatusSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [supabaseStats, setSupabaseStats] = useState<SupabaseStats | null>(null);
    const [testOutput, setTestOutput] = useState<string>("");
    const [testLoading, setTestLoading] = useState(false);

    // Analytics State
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

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

    const fetchAnalytics = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "get_admin_dashboard_stats" })
            });
            const data = await response.json();
            if (data.success) {
                // Ensure dates are formatted for charts
                const formatted = {
                    ...data.stats,
                    registrations_chart: data.stats.registrations_chart.map((d: any) => ({
                        ...d,
                        date: new Date(d.date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })
                    }))
                };
                setAnalytics(formatted);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        fetchSupabaseStats();
        fetchAnalytics();

        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchStatus();
                fetchSupabaseStats();
                if (activeTab === 'analytics') fetchAnalytics();
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, fetchStatus, fetchSupabaseStats, fetchAnalytics, activeTab]);

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

                        {/* Tabs */}
                        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('monitor')}
                                className={`px-4 py-1 rounded text-sm font-medium ${activeTab === 'monitor' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                📡 System Status
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`px-4 py-1 rounded text-sm font-medium ${activeTab === 'analytics' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                📊 Analytics
                            </button>
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
                                onClick={() => { fetchStatus(); fetchAnalytics(); }}
                                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {activeTab === 'monitor' ? '🖥️ Panel de Sistemas' : '📈 Dashboard de Analytics'}
                    </h1>
                    <p className="text-gray-400">
                        {activeTab === 'monitor' ? 'Monitoreo técnico de infraestructura.' : 'Métricas clave de negocio y usuarios.'}
                    </p>
                </div>

                {activeTab === 'monitor' ? (
                    /* ================= MONITOR VIEW ================= */
                    <>
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
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Batch Generators */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Generators */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">✨ Generadores IA</h3>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Tema individual..."
                                        className="flex-1 bg-slate-800 text-white rounded-lg px-3 py-2 border border-white/10"
                                        id="topic-input"
                                    />
                                    <button
                                        onClick={async () => {
                                            const input = document.getElementById("topic-input") as HTMLInputElement;
                                            if (!input.value) return;
                                            setTestLoading(true);
                                            try {
                                                await fetch("/api/admin/generate", {
                                                    method: "POST", body: JSON.stringify({ topic: input.value })
                                                });
                                                setTestOutput(prev => prev + `✅ Generated: ${input.value}\n`);
                                            } catch (e) { setTestOutput(prev => prev + `❌ Error ${e}\n`); }
                                            setTestLoading(false);
                                        }}
                                        className="px-4 bg-blue-600 rounded-lg text-white"
                                    >
                                        Go
                                    </button>
                                </div>

                                <div className="grid gap-3">
                                    <BatchButton
                                        title="📚 Lectura (15)"
                                        topics={["Vocales", "Abecedario", "Sílabas"]}
                                        onLog={msg => setTestOutput(prev => msg + prev)}
                                        onStatsUpdate={fetchSupabaseStats}
                                    />
                                    <BatchButton
                                        title="🧪 Ciencias (12)"
                                        topics={["Sentidos", "Agua", "Plantas"]}
                                        onLog={msg => setTestOutput(prev => msg + prev)}
                                        onStatsUpdate={fetchSupabaseStats}
                                    />
                                </div>
                            </div>

                            {/* Console */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col">
                                <div className="flex justify-between mb-2">
                                    <h3 className="text-white font-semibold">Console</h3>
                                    <button onClick={() => setTestOutput("")} className="text-xs text-gray-400">Clear</button>
                                </div>
                                <pre className="flex-1 bg-slate-900 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-auto max-h-64">
                                    {testOutput || "// Ready..."}
                                </pre>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ================= ANALYTICS VIEW ================= */
                    !analytics ? <div className="text-white">Cargando Analytics...</div> : (
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/30">
                                    <h3 className="text-blue-200 text-sm font-medium mb-2">Total Estudiantes</h3>
                                    <div className="text-4xl font-bold text-white">{analytics.total_users}</div>
                                    <div className="text-blue-300 text-xs mt-2">↑ 12% vs mes pasado</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30">
                                    <h3 className="text-purple-200 text-sm font-medium mb-2">Clases Disponibles</h3>
                                    <div className="text-4xl font-bold text-white">{analytics.total_classes}</div>
                                    <div className="text-purple-300 text-xs mt-2">Contenido verificado</div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/30">
                                    <h3 className="text-emerald-200 text-sm font-medium mb-2">Lecciones Completadas</h3>
                                    <div className="text-4xl font-bold text-white">{analytics.total_completions}</div>
                                    <div className="text-emerald-300 text-xs mt-2">Engagement rate: {analytics.total_users > 0 ? ((analytics.total_completions / analytics.total_users) * 100).toFixed(1) : 0}%</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Main Chart */}
                                <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-6">Crecimiento de Usuarios (7 días)</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={analytics.registrations_chart}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis dataKey="date" stroke="#888" />
                                                <YAxis stroke="#888" />
                                                <RechartsTooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #333' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Top Users Table */}
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">🏆 Estudiantes Top</h3>
                                    <div className="space-y-4">
                                        {analytics.top_users.map((user, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                                                        {user.nombre[0].toUpperCase()}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-medium text-white truncate w-32">{user.nombre}</div>
                                                        <div className="text-xs text-gray-500 truncate w-32">{user.email}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-emerald-400">{user.completed}</div>
                                                    <div className="text-xs text-gray-500">clases</div>
                                                </div>
                                            </div>
                                        ))}
                                        {analytics.top_users.length === 0 && <p className="text-gray-500 text-sm">Sin actividad aún.</p>}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
            </main>
        </div>
    );
}
