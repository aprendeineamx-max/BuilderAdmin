"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui";

interface Profile {
    id: string;
    username: string;
    full_name: string;
    description: string;
    avatar_url: string;
    role: string;
    created_at: string;
}

export default function PublicProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({ courses: 0, points: 0, streak: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            // Fetch profile
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("username", username)
                .single();

            if (data) {
                setProfile(data);
                // Mock stats for now or fetch real if available
                setStats({ courses: 12, points: 4500, streak: 15 });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Carignado perfil...</div>;

    if (!profile) return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-400">Este estudiante no existe o es tímido.</p>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <Navbar />

            {/* Header / Banner */}
            <div className="h-64 bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-contain opacity-20" style={{ backgroundImage: "url('/pattern.svg')" }}></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
                            <div className="w-40 h-40 rounded-full border-4 border-[#0a0a0a] shadow-xl overflow-hidden mb-6 bg-slate-800">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-500">
                                        {profile.full_name?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">{profile.full_name}</h1>
                            <p className="text-blue-400 font-mono mb-4">@{profile.username || username}</p>

                            <div className="flex gap-2 mb-6">
                                <Badge variant="warning">Estudiante</Badge>
                                <Badge variant="info">Pro</Badge>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {profile.description || "Un estudiante apasionado por aprender nuevas habilidades en INEA.mx."}
                            </p>

                            <div className="w-full grid grid-cols-3 gap-4 border-t border-white/5 pt-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-white">{stats.courses}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Cursos</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-400">{stats.points}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Puntos</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-400">🔥 {stats.streak}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Racha</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Contributions Graph (GitHub Style Mock) */}
                        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                📈 Actividad de Aprendizaje
                            </h3>
                            <div className="flex gap-1 overflow-x-auto pb-2">
                                {Array.from({ length: 52 }).map((_, w) => (
                                    <div key={w} className="flex flex-col gap-1">
                                        {Array.from({ length: 7 }).map((_, d) => (
                                            <div
                                                key={d}
                                                className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-green-500/80' :
                                                        Math.random() > 0.9 ? 'bg-green-400' : 'bg-slate-800'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Projects / Courses */}
                        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xl font-bold mb-6">🏆 Certificados Recientes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-white/5 hover:bg-slate-800/50 transition-colors">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl">
                                            📜
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Diplomado en Matemáticas</h4>
                                            <p className="text-xs text-gray-500">Obtenido hace 2 días</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
