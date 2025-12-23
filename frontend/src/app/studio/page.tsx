"use client";

import StudioLayout from "@/components/StudioLayout";
import { BarChart, Users, BookOpen, DollarSign } from "lucide-react";

export default function StudioPage() {
    return (
        <StudioLayout>
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Estudiantes Activos', val: '1,234', icon: Users, color: 'text-blue-400' },
                        { label: 'Cursos Publicados', val: '12', icon: BookOpen, color: 'text-green-400' },
                        { label: 'Tasa de Finalización', val: '86%', icon: BarChart, color: 'text-purple-400' },
                        { label: 'Ingresos Estimados', val: '$0.00', icon: DollarSign, color: 'text-yellow-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">+12% vs mes anterior</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.val}</h3>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Drafts Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6">Borradores Recientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="group cursor-pointer bg-slate-800 rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-900/20">
                                <div className="h-32 bg-slate-700 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                        Cover Image
                                    </div>
                                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/50 text-xs text-white">
                                        Borrador
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                        Curso de Historia Avanzada {i}
                                    </h4>
                                    <p className="text-sm text-gray-400 mb-4">Última edición hace 2h</p>
                                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-1/3" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-right">33% completado</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StudioLayout>
    );
}
