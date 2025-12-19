"use client";

import { useState } from "react";
import Link from "next/link";

export default function PerfilPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        nombre: "María García",
        email: "maria.garcia@ejemplo.com",
        nivel: "Secundaria",
        telefono: "55 1234 5678",
        ciudad: "Ciudad de México",
        fechaRegistro: "15 de Noviembre, 2024"
    });

    const stats = {
        clasesCompletadas: 12,
        quizzesAprobados: 8,
        horasEstudio: 24,
        diasRacha: 5
    };

    const certificados = [
        { id: 1, nombre: "Matemáticas Básicas", fecha: "10 Dic 2024", estado: "completado" },
        { id: 2, nombre: "Comprensión Lectora", fecha: "En progreso", estado: "progreso" }
    ];

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
                            <Link href="/cursos" className="text-gray-300 hover:text-white">Cursos</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-4xl text-white font-bold">
                            {userData.nombre.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white">{userData.nombre}</h1>
                            <p className="text-gray-400">{userData.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                    {userData.nivel}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    Miembro desde {userData.fechaRegistro}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                            {isEditing ? "Guardar" : "Editar Perfil"}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-blue-400">{stats.clasesCompletadas}</div>
                        <div className="text-gray-400 text-sm">Clases Completadas</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-emerald-400">{stats.quizzesAprobados}</div>
                        <div className="text-gray-400 text-sm">Quizzes Aprobados</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-purple-400">{stats.horasEstudio}h</div>
                        <div className="text-gray-400 text-sm">Horas de Estudio</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-amber-400">{stats.diasRacha}🔥</div>
                        <div className="text-gray-400 text-sm">Días de Racha</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Información Personal</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={userData.nombre}
                                    onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full mt-1 bg-slate-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    disabled
                                    className="w-full mt-1 bg-slate-700 text-white rounded-lg px-4 py-2 opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Teléfono</label>
                                <input
                                    type="tel"
                                    value={userData.telefono}
                                    onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full mt-1 bg-slate-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Ciudad</label>
                                <input
                                    type="text"
                                    value={userData.ciudad}
                                    onChange={(e) => setUserData({ ...userData, ciudad: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full mt-1 bg-slate-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Mis Certificados</h2>
                        <div className="space-y-3">
                            {certificados.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">
                                            {cert.estado === "completado" ? "🎓" : "📝"}
                                        </span>
                                        <div>
                                            <div className="text-white font-medium">{cert.nombre}</div>
                                            <div className="text-gray-400 text-sm">{cert.fecha}</div>
                                        </div>
                                    </div>
                                    {cert.estado === "completado" ? (
                                        <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30">
                                            Descargar PDF
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                                            En Progreso
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Link href="/cursos" className="block mt-4 text-center text-blue-400 hover:text-blue-300 text-sm">
                            Ver más cursos para certificarte →
                        </Link>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-6 bg-red-500/10 rounded-2xl border border-red-500/30 p-6">
                    <h2 className="text-lg font-semibold text-red-400 mb-2">Zona de Peligro</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Estas acciones son permanentes y no se pueden deshacer.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            Eliminar Cuenta
                        </button>
                        <button className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
                            Descargar mis Datos
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
