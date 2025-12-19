import Link from "next/link";

export default function RegisterPage() {
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

                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="María"
                                    className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Apellido</label>
                                <input
                                    type="text"
                                    placeholder="García"
                                    className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="tu@correo.com"
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">¿Qué nivel quieres estudiar?</label>
                            <select className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10">
                                <option value="primaria">Primaria</option>
                                <option value="secundaria">Secundaria</option>
                                <option value="ambos">Ambos niveles</option>
                            </select>
                        </div>

                        <label className="flex items-start gap-3 text-gray-300 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 mt-1 rounded border-gray-600 bg-slate-700 text-blue-500" />
                            <span className="text-sm">
                                Acepto los <a href="#" className="text-blue-400">Términos de Servicio</a> y la{" "}
                                <a href="#" className="text-blue-400">Política de Privacidad</a>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                        >
                            Crear Cuenta Gratis
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
