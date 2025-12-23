"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, Upload, Settings, Plus } from "lucide-react";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        INEA Studio
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Panel de Instructor</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/studio" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/20 text-purple-300 font-medium">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/studio/content" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                        <FileText size={20} /> Mis Cursos
                    </Link>
                    <Link href="/studio/media" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                        <Upload size={20} /> Bibl. Multimedia
                    </Link>
                    <Link href="/studio/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                        <Settings size={20} /> Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-purple-900/20">
                        <Plus size={20} /> Nuevo Curso
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-medium text-gray-300">Bienvenido, Profesor</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50" />
                    </div>
                </header>
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
