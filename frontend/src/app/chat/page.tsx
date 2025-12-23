"use client";

import { useState } from "react";
import Link from "next/link";
import ChatTutor from "@/components/ChatTutor";

export default function ChatPage() {
    const [lessonContext, setLessonContext] = useState("general");

    const getContextDescription = (ctx: string) => {
        switch (ctx) {
            case "matematicas": return "Matemáticas Generales, Aritmética, Geometría.";
            case "fracciones": return "Operaciones con fracciones, quebrados.";
            case "lectura": return "Comprensión lectora, gramática, ortografía.";
            case "ciencias": return "Biología, Física básica, Salud.";
            case "historia": return "Historia de México, Civismo.";
            default: return "Cualquier tema educativo de nivel primaria/secundaria.";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
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
                            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/cursos" className="text-gray-300 hover:text-white transition-colors">
                                Cursos
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chat Container */}
            <main className="flex-1 pt-20 pb-4 px-4 max-w-5xl mx-auto w-full flex flex-col">

                {/* Context Selector */}
                <div className="mb-4 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-xl">🎓</span>
                        <span className="font-medium hidden sm:inline">Modo Tutor:</span>
                    </div>
                    <select
                        value={lessonContext}
                        onChange={(e) => setLessonContext(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="general">General</option>
                        <option value="matematicas">Matemáticas</option>
                        <option value="fracciones">Fracciones</option>
                        <option value="lectura">Lectura y Escritura</option>
                        <option value="ciencias">Ciencias Naturales</option>
                        <option value="historia">Historia y Civismo</option>
                    </select>
                </div>

                {/* Chat Component */}
                <div className="flex-1 min-h-0 relative">
                    <ChatTutor
                        title={lessonContext.charAt(0).toUpperCase() + lessonContext.slice(1)}
                        context={getContextDescription(lessonContext)}
                        className="h-full shadow-2xl"
                    />
                </div>
            </main>
        </div>
    );
}
