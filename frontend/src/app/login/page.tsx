"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Error al iniciar sesión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
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
                    <p className="text-gray-400 mt-2">Educación para todos</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                    <h1 className="text-2xl font-bold text-white text-center mb-6">
                        Inicia Sesión
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                required
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-slate-700 text-blue-500" />
                                Recordarme
                            </label>
                            <a href="#" className="text-blue-400 hover:text-blue-300">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            ¿No tienes cuenta?{" "}
                            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mt-6 flex items-center">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-4 text-gray-500 text-sm">o continúa con</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    {/* Social Login */}
                    <div className="mt-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                        >
                            <span>🔵</span> Continuar con Google
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Al iniciar sesión aceptas nuestros{" "}
                    <Link href="/terminos" className="text-blue-400">Términos</Link> y{" "}
                    <Link href="/privacidad" className="text-blue-400">Privacidad</Link>
                </p>
            </div>
        </div>
    );
}
