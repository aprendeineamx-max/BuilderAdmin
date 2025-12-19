"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        nivel: "secundaria",
    });
    const [stats, setStats] = useState({
        clasesCompletadas: 0,
        promedio: 0,
        racha: 0
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        } else if (user) {
            // Load user data
            setFormData({
                nombre: user.user_metadata?.nombre || "Usuario",
                email: user.email || "",
                nivel: user.user_metadata?.nivel || "secundaria",
            });

            // Load stats (mock for now until we have real progress table)
            setStats({
                clasesCompletadas: 0,
                promedio: 0,
                racha: 0
            });
        }
    }, [user, authLoading, router]);

    const handleUpdate = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    nombre: formData.nombre,
                    nivel: formData.nivel
                }
            });

            if (error) throw error;
            setIsEditing(false);
            // Optional: Show success toast
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pb-20">
            {/* Header */}
            <div className="bg-slate-900/50 border-b border-white/10 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                        {formData.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{formData.nombre}</h1>
                        <div className="flex items-center gap-3 text-gray-400">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30">
                                Estudiante de {formData.nivel.charAt(0).toUpperCase() + formData.nivel.slice(1)}
                            </span>
                            <span>•</span>
                            <span>{formData.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-8">
                {/* Left Column: Stats */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Progreso</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Nivel Completado</span>
                                    <span className="text-white font-medium">0%</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 w-0" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                    <span className="block text-2xl font-bold text-white">{stats.clasesCompletadas}</span>
                                    <span className="text-xs text-gray-400">Clases</span>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                    <span className="block text-2xl font-bold text-emerald-400">{stats.promedio}</span>
                                    <span className="text-xs text-gray-400">Promedio</span>
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
                                <span className="text-2xl">🔥</span>
                                <div>
                                    <div className="text-white font-bold">{stats.racha} días</div>
                                    <div className="text-xs text-amber-400">Racha de estudio</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Certificados</h3>
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl block mb-2 opacity-50">🎓</span>
                            <p className="text-sm">Completa tus cursos para obtener certificados</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Información Personal</h3>
                            <button
                                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                {isEditing ? "Guardar Cambios" : "Editar Perfil"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nivel Educativo</label>
                                    <select
                                        disabled={!isEditing}
                                        value={formData.nivel}
                                        onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="primaria">Primaria</option>
                                        <option value="secundaria">Secundaria</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Preferencias</h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
                                <span className="text-gray-300">Notificaciones por correo</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 bg-slate-800 text-blue-500" />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
                                <span className="text-gray-300">Modo oscuro automático</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 bg-slate-800 text-blue-500" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-red-500/5 rounded-2xl border border-red-500/10 p-6">
                        <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Peligro</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Cerrar Sesión</p>
                                <p className="text-sm text-gray-500">Finaliza tu sesión actual en este dispositivo</p>
                            </div>
                            <button
                                onClick={signOut}
                                className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
