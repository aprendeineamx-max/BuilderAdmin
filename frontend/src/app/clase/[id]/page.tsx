"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Clase {
    id: number;
    tema: string;
    contenido: string;
    modelo: string;
    tokens_usados: number;
    created_at: string;
}

export default function ClasePage() {
    const params = useParams();
    const claseId = params.id;
    const [clase, setClase] = useState<Clase | null>(null);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
        // Fetch class from Supabase
        const fetchClase = async () => {
            try {
                const supaKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";
                const res = await fetch(`http://64.177.81.23:8000/rest/v1/clases_generadas?id=eq.${claseId}`, {
                    headers: {
                        apikey: supaKey,
                        Authorization: `Bearer ${supaKey}`
                    }
                });
                const data = await res.json();
                if (data && data.length > 0) {
                    setClase(data[0]);
                }
            } catch (error) {
                console.error("Error fetching class:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClase();
    }, [claseId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando clase...</div>
            </div>
        );
    }

    if (!clase) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <div className="text-white text-xl mb-4">Clase no encontrada</div>
                    <Link href="/cursos" className="text-blue-400 hover:text-blue-300">
                        ← Volver a cursos
                    </Link>
                </div>
            </div>
        );
    }

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
                            <Link href="/chat" className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30">
                                <span>🤖</span> Preguntar al Tutor
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/cursos" className="text-gray-400 hover:text-white transition-colors">
                        ← Volver a Cursos
                    </Link>
                </div>

                {/* Class Header */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm mb-3">
                                📚 Lección
                            </span>
                            <h1 className="text-3xl font-bold text-white mb-2">{clase.tema}</h1>
                            <p className="text-gray-400 text-sm">
                                Generada con IA • {clase.tokens_usados} tokens • {new Date(clase.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                                📥
                            </button>
                            <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                                🔗
                            </button>
                        </div>
                    </div>
                </div>

                {/* Class Content */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
                    <div className="prose prose-invert max-w-none">
                        <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                            {clase.contenido}
                        </div>
                    </div>
                </div>

                {/* Quiz Section */}
                {!showQuiz ? (
                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-500/30 p-6 text-center">
                        <span className="text-4xl block mb-4">✍️</span>
                        <h2 className="text-xl font-bold text-white mb-2">¿Listo para el Quiz?</h2>
                        <p className="text-gray-400 mb-4">Pon a prueba lo que aprendiste con 3 preguntas</p>
                        <button
                            onClick={() => setShowQuiz(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90"
                        >
                            Comenzar Quiz
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📝 Quiz de la Lección</h2>
                        <p className="text-gray-400 mb-6">Las preguntas del quiz están incluidas en el contenido de la clase arriba.</p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600">
                                Marcar como Completado
                            </button>
                            <Link href="/cursos" className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20">
                                Siguiente Lección
                            </Link>
                        </div>
                    </div>
                )}

                {/* AI Help */}
                <div className="mt-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
                            🤖
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold">¿Tienes dudas sobre esta lección?</h3>
                            <p className="text-gray-400 text-sm">Profe INEA puede ayudarte a entender mejor</p>
                        </div>
                        <Link href="/chat" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">
                            Preguntar
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
