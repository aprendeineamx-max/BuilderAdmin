"use client";

import CommunityLayout from "@/components/CommunityLayout";
import { MessageSquare, Users, Pin } from "lucide-react";

export default function ForosPage() {
    const forums = [
        { id: 'general', title: 'General', desc: 'Discusión general', icon: '💬', threads: 120 },
        { id: 'ayuda', title: 'Ayuda con Tareas', desc: 'Resuelve tus dudas', icon: '🆘', threads: 340 },
        { id: 'proyectos', title: 'Proyectos', desc: 'Comparte tus logros', icon: '🏆', threads: 45 },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <main className="flex-1 pt-24 pb-12">
                <CommunityLayout>
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold mb-6">Foros de Discusión</h1>

                        <div className="grid gap-4">
                            {forums.map(forum => (
                                <div key={forum.id} className="bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors flex items-center gap-4 cursor-pointer">
                                    <div className="text-4xl">{forum.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{forum.title}</h3>
                                        <p className="text-gray-400">{forum.desc}</p>
                                    </div>
                                    <div className="text-right text-gray-500 text-sm">
                                        <p>{forum.threads} hilos</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Pin size={18} className="text-blue-400" /> Hilos Destacados
                            </h2>
                            {/* Mock Threads */}
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:bg-slate-800/60 transition-colors">
                                        <h4 className="font-medium text-blue-300 hover:underline cursor-pointer">
                                            Guía oficial para el examen de certificación 2025
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">por Admin • hace 2 días</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CommunityLayout>
            </main>
        </div>
    );
}
