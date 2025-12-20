"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, Button, Card, ProgressBar, Badge, Skeleton } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Simple Toast Component for this page
const SimpleToast = ({ message, type, onClose }: { message: string, type: "success" | "error", onClose: () => void }) => (
    <div className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in cursor-pointer ${type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`} onClick={onClose}>
        <span>{type === "success" ? "✓" : "✕"}</span>
        <span className="font-medium">{message}</span>
    </div>
);

interface UserProfile {
    id: string;
    username: string;
    full_name: string;
    bio: string;
    nivel: string;
    avatar_url: string;
    progreso: any;
}

export default function PerfilPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        bio: "",
        nivel: "primaria"
    });

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/perfil");
        }

        if (user) {
            fetchProfile();
        }
    }, [user, authLoading, router]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user?.id)
                .single();

            if (data) {
                setProfile(data);
                setFormData({
                    full_name: data.full_name || "",
                    username: data.username || "",
                    bio: data.bio || "",
                    nivel: data.nivel || "primaria"
                });
            } else if (user) {
                // Initialize form with auth data if no profile yet
                setFormData({
                    full_name: user.user_metadata?.full_name || "",
                    username: user.email?.split('@')[0] || "",
                    bio: "",
                    nivel: "primaria"
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const updates = {
                full_name: formData.full_name,
                username: formData.username,
                bio: formData.bio,
                // nivel: formData.nivel, // Assuming this is stored in profiles now or we ignore it
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from("profiles")
                .upsert({ id: user?.id, ...updates });

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, ...updates } as UserProfile : null);
            setEditing(false);
            setToast({ message: "Perfil actualizado correctamente", type: "success" });

            // Clear toast after 3s
            setTimeout(() => setToast(null), 3000);
        } catch (error) {
            console.error("Error updating:", error);
            setToast({ message: "Error al actualizar perfil", type: "error" });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Navbar />
                <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                    <Skeleton className="h-64 w-full rounded-2xl mb-8" />
                    <div className="grid md:grid-cols-3 gap-6">
                        <Skeleton className="h-40 rounded-xl" />
                        <Skeleton className="h-40 rounded-xl" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Navbar />

            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Header Profile */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            {/* Avatar Logic: Check if we have a URL, else use Initials Component */}
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-slate-700 shadow-xl object-cover"
                                />
                            ) : (
                                <div className="transform scale-[2.0]">
                                    <Avatar name={formData.full_name || "U"} size="lg" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            {editing ? (
                                <div className="space-y-4 max-w-sm">
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Tu nombre completo"
                                    />
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Nombre de usuario (único)"
                                    />
                                    <textarea
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 resize-none h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Cuéntanos sobre ti..."
                                    />
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        <Button variant="primary" onClick={handleUpdate}>Guardar</Button>
                                        <Button variant="secondary" onClick={() => setEditing(false)}>Cancelar</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-white">{formData.full_name || "Estudiante INEA"}</h1>
                                    <p className="text-blue-400 font-mono">@{formData.username || "usuario"}</p>
                                    <p className="text-gray-400 max-w-md mx-auto md:mx-0 truncate">
                                        {formData.bio || "Sin biografía"}
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                                        <Button variant="secondary" onClick={() => setEditing(true)}>
                                            ✏️ Editar Perfil
                                        </Button>
                                        {formData.username && (
                                            <Button variant="primary" onClick={() => router.push(`/u/${formData.username}`)}>
                                                🌐 Ver Perfil Público
                                            </Button>
                                        )}
                                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => supabase.auth.signOut()}>
                                            Cerrar Sesión
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Progress Section */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Mi Progreso</h2>

                        <Card className="border-l-4 border-l-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Certificado de Primaria</h3>
                                    <p className="text-sm text-gray-400">En curso • Nivel Actual</p>
                                </div>
                                <Badge variant="warning">En Progreso</Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Avance general</span>
                                    <span>{Math.min((profile?.progreso?.clases_completadas || 0) * 5, 100)}%</span>
                                </div>
                                <ProgressBar value={Math.min((profile?.progreso?.clases_completadas || 0) * 5, 100)} />
                            </div>

                            <p className="text-sm text-gray-500">
                                Completa todas las lecciones y quizzes para obtener tu certificado oficial.
                            </p>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-white font-semibold mb-4">Insignias</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="aspect-square bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20 text-2xl grayscale hover:grayscale-0 transition-all cursor-help" title="Desbloquea al completar 5 clases">
                                    🏆
                                </div>
                                <div className="aspect-square bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 text-2xl grayscale hover:grayscale-0 transition-all cursor-help" title="Desbloquea al completar un examen">
                                    🎓
                                </div>
                                <div className="aspect-square bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 text-2xl grayscale hover:grayscale-0 transition-all cursor-help" title="Desbloquea con racha de 7 días">
                                    🔥
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            {toast && <SimpleToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
