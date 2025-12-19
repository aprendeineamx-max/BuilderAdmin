"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar, Button, Card, Progress, Badge, Skeleton, Toast } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserProfile {
    nombre: string;
    email: string;
    nivel: string;
    progreso: {
        clases_completadas: number;
        promedio_calificacion: number;
        ultima_actividad: string;
    };
}

export default function PerfilPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ nombre: "", nivel: "primaria" });
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
                .from("usuarios")
                .select("*")
                .eq("id", user?.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                // Fallback or create if missing (though trigger should handle it)
            }

            if (data) {
                setProfile(data);
                setFormData({ nombre: data.nombre || "", nivel: data.nivel || "primaria" });
            } else if (user) {
                // Fallback for immediate display if trigger hasn't finished
                setProfile({
                    nombre: user.user_metadata?.full_name || "Usuario",
                    email: user.email || "",
                    nivel: "primaria",
                    progreso: { clases_completadas: 0, promedio_calificacion: 0, ultima_actividad: new Date().toISOString() }
                });
                setFormData({ nombre: user.user_metadata?.full_name || "", nivel: "primaria" });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const { error } = await supabase
                .from("usuarios")
                .update({
                    nombre: formData.nombre,
                    nivel: formData.nivel,
                })
                .eq("id", user?.id);

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, ...formData } : null);
            setEditing(false);
            setToast({ message: "Perfil actualizado correctamente", type: "success" });
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
                        <Skeleton className="h-40 rounded-xl" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Header Profile */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <Avatar
                                src={user?.user_metadata?.avatar_url || "/avatar-placeholder.png"}
                                alt={profile?.nombre || "Usuario"}
                                fallback={(profile?.nombre?.[0] || "U").toUpperCase()}
                                className="w-32 h-32 border-4 border-slate-700 shadow-xl text-4xl"
                            />
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-800"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            {editing ? (
                                <div className="space-y-4 max-w-sm">
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Tu nombre completo"
                                    />
                                    <select
                                        value={formData.nivel}
                                        onChange={e => setFormData({ ...formData, nivel: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="primaria">Primaria</option>
                                        <option value="secundaria">Secundaria</option>
                                    </select>
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        <Button variant="primary" onClick={handleUpdate}>Guardar</Button>
                                        <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-white">{profile?.nombre || "Estudiante INEA"}</h1>
                                    <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                        <span>{profile?.email}</span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="capitalize text-blue-400">{profile?.nivel}</span>
                                    </p>
                                    <div className="flex gap-3 justify-center md:justify-start mt-4">
                                        <Button variant="outline" onClick={() => setEditing(true)}>
                                            ✏️ Editar Perfil
                                        </Button>
                                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => supabase.auth.signOut()}>
                                            Cerrar Sesión
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-white/5 rounded-xl p-6 min-w-[200px] border border-white/5 text-center">
                            <div className="text-4xl font-bold text-white mb-1">{profile?.progreso?.clases_completadas || 0}</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Clases Completadas</div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Progress Section */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Mi Progreso</h2>

                        {/* Certificado en progreso */}
                        <Card className="p-6 border-l-4 border-l-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Certificado de Primaria</h3>
                                    <p className="text-sm text-gray-400">En curso • {profile?.nivel === 'primaria' ? 'Nivel Actual' : 'Completado'}</p>
                                </div>
                                <Badge variant="warning">En Progreso</Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Avance general</span>
                                    <span>{Math.min((profile?.progreso?.clases_completadas || 0) * 5, 100)}%</span>
                                </div>
                                <Progress value={Math.min((profile?.progreso?.clases_completadas || 0) * 5, 100)} className="h-2 bg-slate-800" indicatorClassName="bg-blue-500" />
                            </div>

                            <p className="text-sm text-gray-500">
                                Completa todas las lecciones y quizzes para obtener tu certificado oficial verificado por la SEP.
                            </p>
                        </Card>

                        {/* Recent Activity (Mocked for now until we have eventos_usuario) */}
                        <h3 className="text-lg font-semibold text-white pt-4">Actividad Reciente</h3>
                        <div className="space-y-3">
                            <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">✅</div>
                                    <div>
                                        <div className="text-white font-medium">Registro Completado</div>
                                        <div className="text-xs text-gray-400">Hace un momento</div>
                                    </div>
                                </div>
                                <Badge variant="success">+100 XP</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Achievements */}
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

                        {/* Next Steps */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold mb-2">Continúa Aprendiendo</h3>
                            <p className="text-sm text-blue-100 mb-4">
                                El Tutor IA está listo para ayudarte con tu siguiente lección.
                            </p>
                            <Button variant="default" className="w-full bg-white text-blue-700 hover:bg-blue-50" onClick={() => router.push('/chat')}>
                                Ir con el Profe IA
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
