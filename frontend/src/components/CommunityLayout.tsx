"use client";

import Link from "next/link";
import { MessageSquare, Users, TrendingUp, Search, PlusCircle } from "lucide-react";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
            {/* Left Sidebar (Navigation) */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                    <Link
                        href="/comunidad"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium mb-2"
                    >
                        <TrendingUp size={20} /> Feed Global
                    </Link>
                    <Link
                        href="/comunidad/foros"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        <MessageSquare size={20} /> Foros
                    </Link>
                    <Link
                        href="/comunidad/miembros"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        <Users size={20} /> Miembros
                    </Link>
                </div>

                {/* Tags / Trending */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                    <h3 className="font-bold text-gray-200 mb-4">Temas Populares</h3>
                    <div className="flex flex-wrap gap-2">
                        {['#Matemáticas', '#Examen', '#Primaria', '#Dudas', '#Certificado'].map(tag => (
                            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-slate-700 text-gray-300 cursor-pointer hover:bg-blue-500/20 hover:text-blue-300 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {children}
            </div>

            {/* Right Sidebar (Suggestions) */}
            <aside className="hidden xl:block w-72 flex-shrink-0 space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                    <h3 className="font-bold text-gray-200 mb-4">A quién seguir</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-white truncate">Estudiante {i}</p>
                                    <p className="text-xs text-gray-400">Nivel Secundaria</p>
                                </div>
                                <button className="text-blue-400 hover:text-blue-300 text-xs font-bold">
                                    +Seguir
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
}
