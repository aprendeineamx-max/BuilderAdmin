"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Clase {
    id: number;
    tema: string;
    contenido: string;
    modelo: string;
    tokens_usados: number;
    created_at: string;
}

export default function CursosPage() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const { data, error } = await supabase
                    .from('clases_generadas')
                    .select('*')
                    .order('id', { ascending: false });

                if (error) throw error;

                setClases(data || []);
                setFilter("all"); // Force filter reset on load
            } catch (error) {
                console.error("Error fetching classes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClases();
    }, []);

    const categorizeClass = (tema: string) => {
        const t = tema ? tema.toLowerCase() : "";
        if (t.includes("suma") || t.includes("resta") || t.includes("multiplic") || t.includes("division") || t.includes("fraccion") || t.includes("porcentaje") || t.includes("geometria")) return "matematicas";
        if (t.includes("lectura") || t.includes("escritura") || t.includes("ortografia") || t.includes("comprension") || t.includes("vocal")) return "lectura";
        if (t.includes("cuerpo") || t.includes("salud") || t.includes("alimentacion") || t.includes("ambiente") || t.includes("natural")) return "ciencias";
        if (t.includes("historia") || t.includes("derecho") || t.includes("ciudadan") || t.includes("civismo")) return "sociedad";
        return "general";
    };

    const getIcon = (category: string) => {
        switch (category) {
            case "matematicas": return "📐";
            case "lectura": return "📚";
            case "ciencias": return "🌿";
            case "sociedad": return "🏛️";
            default: return "📖";
        }
    };

    const getColor = (category: string) => {
        switch (category) {
            case "matematicas": return "blue";
            case "lectura": return "emerald";
            case "ciencias": return "purple";
            case "sociedad": return "amber";
            default: return "gray";
        }
    };

    const filteredClases = (filter === "all" || !filter)
        ? clases
        : clases.filter(c => categorizeClass(c.tema) === filter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-white font-bold text-xl">INEA.mx</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
                            <Link href="/chat" className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30">
                                <span>🤖</span> Tutor IA
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Biblioteca de Clases</h1>
                    <p className="text-gray-400">
                        {clases.length} lecciones disponibles generadas con Inteligencia Artificial
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {["all", "matematicas", "lectura", "ciencias", "sociedad"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
                                ? "bg-blue-500 text-white"
                                : "bg-white/5 text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            {f === "all" ? "📚 Todas" :
                                f === "matematicas" ? "📐 Matemáticas" :
                                    f === "lectura" ? "📖 Lectura" :
                                        f === "ciencias" ? "🌿 Ciencias" : "🏛️ Sociedad"}
                        </button>
                    ))}
                </div>

                {/* Classes Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-white text-xl">Cargando clases...</div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClases.map((clase) => {
                            const category = categorizeClass(clase.tema);
                            const color = getColor(category);
                            return (
                                <Link
                                    key={clase.id}
                                    href={`/clase/${clase.id}`}
                                    className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center text-2xl`}>
                                            {getIcon(category)}
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400`}>
                                            {category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{clase.tema}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {clase.contenido.substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{clase.tokens_usados} tokens</span>
                                        <span>{new Date(clase.created_at).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {filteredClases.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <div className="text-white text-xl mb-2">No hay clases en esta categoría</div>
                        <button onClick={() => setFilter("all")} className="text-blue-400 hover:text-blue-300">
                            Ver todas las clases
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
