"use client";

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Link from 'next/link';

// Mock Data for "Escuela de Matemáticas"
const MOCK_DATA = {
    name: "Escuela de Matemáticas",
    description: "Domina el lenguaje universal. Desde los números básicos hasta el cálculo diferencial.",
    icon: "🧮",
    rutas: [
        {
            id: 101,
            name: "Ruta de Fundamentos de Aritmética",
            slug: "aritmetica",
            description: "Aprende a sumar, restar, multiplicar y dividir sin miedo.",
            level: "Básico",
            courses_count: 5,
            progress: 0
        },
        {
            id: 102,
            name: "Ruta de Álgebra Básica",
            slug: "algebra",
            description: "Entiende las variables y ecuaciones. El primer paso a la ingeniería.",
            level: "Intermedio",
            courses_count: 8,
            progress: 0
        },
        {
            id: 103,
            name: "Ruta de Geometría y Espacio",
            slug: "geometria",
            description: "Figuras, áreas, volúmenes y trigonometría.",
            level: "Intermedio",
            courses_count: 6,
            progress: 0
        }
    ]
};

export default function EscuelaPage() {
    const { slug } = useParams();
    // In real implementation: fetch school by slug from Supabase
    const school = MOCK_DATA;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-slate-900 to-[#0a0a0a] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-blue-500/20">
                        {school.icon}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{school.name}</h1>
                    <p className="text-xl text-gray-400 max-w-2xl">{school.description}</p>
                </div>
            </div>

            {/* Rutas Grid */}
            <main className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <span className="w-1 h-8 bg-blue-500 rounded-full" />
                    Rutas de Aprendizaje Disponibles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {school.rutas.map((ruta) => (
                        <Link key={ruta.id} href={`/ruta/${ruta.slug}`} className="group">
                            <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 hover:bg-[#1a1a1a] transition-all hover:border-blue-500/30">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${ruta.level === 'Básico' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                        {ruta.level}
                                    </span>
                                    <span className="text-gray-500 text-sm">{ruta.courses_count} Cursos</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{ruta.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{ruta.description}</p>

                                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                                    <div className="bg-blue-500 h-full w-0" />
                                </div>
                                <span className="text-xs text-gray-500">0% Completado</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
