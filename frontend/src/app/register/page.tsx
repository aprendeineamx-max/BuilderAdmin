"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Provider } from "@supabase/supabase-js";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        nivel: "secundaria"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!acceptTerms) {
            setError("Debes aceptar los términos y condiciones");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        nombre: `${formData.nombre} ${formData.apellido}`,
                        nivel: formData.nivel
                    }
                }
            });

            if (error) {
                setError(error.message);
            } else {
                router.push("/dashboard?welcome=true");
            }
        } catch {
            setError("Error al crear la cuenta. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setError(error.message);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">I</span>
                        </div>
                        <span className="text-white font-bold text-2xl">INEA.mx</span>
                    </Link>
                    <p className="text-gray-400 mt-2">Comienza tu educación hoy</p>
                </div>

                {/* Register Card */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                    <h1 className="text-2xl font-bold text-white text-center mb-6">
                        Crea tu Cuenta
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="María"
                                    required
                                    className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="García"
                                    required
                                    className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@correo.com"
                                required
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                                required
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">¿Qué nivel quieres estudiar?</label>
                            <select
                                name="nivel"
                                value={formData.nivel}
                                onChange={handleChange}
                                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            >
                                <option value="primaria">Primaria</option>
                                <option value="secundaria">Secundaria</option>
                                <option value="ambos">Ambos niveles</option>
                            </select>
                        </div>

                        <label className="flex items-start gap-3 text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 mt-1 rounded border-gray-600 bg-slate-700 text-blue-500"
                            />
                            <span className="text-sm">
                                Acepto los <Link href="/terminos" className="text-blue-400">Términos de Servicio</Link> y la{" "}
                                <Link href="/privacidad" className="text-blue-400">Política de Privacidad</Link>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Creando cuenta..." : "Crear Cuenta Gratis"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            ¿Ya tienes cuenta?{" "}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mt-6 flex items-center">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-4 text-gray-500 text-sm">o regístrate con</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    {/* Social Login */}
                    <div className="mt-6 flex gap-3 justify-center">
                        <button
                            onClick={() => handleOAuthLogin('google')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                            title="Google"
                        >
                            <span>🔵</span> <span className="hidden sm:inline">Google</span>
                        </button>
                        <button
                            onClick={() => handleOAuthLogin('github')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                            title="GitHub"
                        >
                            <span>🐙</span> <span className="hidden sm:inline">GitHub</span>
                        </button>
                        <button
                            onClick={() => handleOAuthLogin('facebook')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                            title="Facebook"
                        >
                            <span>📘</span> <span className="hidden sm:inline">Facebook</span>
                        </button>
                    </div>

                </div>

                {/* Benefits */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="text-gray-400">
                        <span className="text-2xl block mb-1">🎓</span>
                        <span className="text-xs">Certificación Oficial</span>
                    </div>
                    <div className="text-gray-400">
                        <span className="text-2xl block mb-1">🤖</span>
                        <span className="text-xs">Tutor IA 24/7</span>
                    </div>
                    <div className="text-gray-400">
                        <span className="text-2xl block mb-1">💰</span>
                        <span className="text-xs">100% Gratis</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
