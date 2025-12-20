"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ActivityFeed from "@/components/ActivityFeed";
import { Badge, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";

export default function ComunidadPage() {
    const [topStudents, setTopStudents] = useState<any[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data } = await supabase
                .from('user_streaks')
                .select('*')
                .order('current_streak', { ascending: false })
                .limit(5);

            // Note: We might need to fetch profiles if user_streaks ONLY has ID.
            // For now, let's assume we need to fetch usernames separately or join if possible.
            // Since public.profiles access might be tricky if not set up, let's just use IDs or fetch profiles if available.
            // Actually, let's stick to the placeholder logic I planned but powered by real data if possible, 
            // otherwise use a mock user list if data is empty (Phase 12 dev).

            if (data && data.length > 0) {
                // Fetch names
                // For now, just use IDs
                setTopStudents(data);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Feed */}
                <div className="lg:col-span-2">
                    <div className="mb-8 p-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="relative z-10">
                            <Badge variant="warning" className="mb-4">Beta</Badge>
                            <h1 className="text-4xl font-bold text-white mb-4">Comunidad INEA.mx</h1>
                            <p className="text-xl text-blue-200">
                                Descubre lo que están aprendiendo otros estudiantes en tiempo real.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        📡 Actividad Reciente
                    </h2>
                    <ActivityFeed />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800/20 rounded-2xl p-6 border border-white/5 sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            🏆 Top Estudiantes
                        </h2>

                        <div className="space-y-4">
                            {topStudents.length > 0 ? (
                                topStudents.map((student, index) => (
                                    <div key={student.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition">
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold relative">
                                            {index + 1}
                                            {index === 0 && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium text-sm truncate w-24">
                                                {/* Mask ID for privacy */}
                                                Usuario {student.user_id.slice(0, 4)}
                                            </div>
                                            <div className="text-xs text-gray-500">Nivel Intermedio</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                                                <span>{student.current_streak}</span>
                                                <span className="text-xs">🔥</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-500 text-sm">
                                    <p>Sé el primero en iniciar una racha esta semana.</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Gamification Promo */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-2xl p-6 border border-indigo-500/20">
                        <h3 className="font-bold text-indigo-300 mb-2">🚀 Sube de Nivel</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Completa clases para ganar insignias y desbloquear nuevos rangos.
                        </p>
                        <button className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">
                            Ver mis Insignias
                        </button>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
