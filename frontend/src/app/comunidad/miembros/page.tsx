"use client";

import CommunityLayout from "@/components/CommunityLayout";
import { Search } from "lucide-react";

export default function MiembrosPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <main className="flex-1 pt-24 pb-12">
                <CommunityLayout>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Directorio de Estudiantes</h1>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar estudiante..."
                                    className="bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mb-4" />
                                    <h3 className="font-bold text-white">Estudiante {i}</h3>
                                    <p className="text-sm text-gray-400 mb-4">Nivel Secundaria</p>
                                    <div className="flex gap-2 w-full">
                                        <button className="flex-1 py-2 rounded-lg bg-blue-600 text-sm font-medium hover:bg-blue-500 transition-colors">
                                            Seguir
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg bg-slate-700 text-sm font-medium hover:bg-slate-600 transition-colors">
                                            Perfil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CommunityLayout>
            </main>
        </div>
    );
}
