"use client";

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_RUTA = {
    name: "Ruta de Fundamentos de Aritmética",
    description: "La base de todas las matemáticas. Aprende a operar números con confianza.",
    progress: 15,
    courses: [
        {
            id: 1,
            title: "Curso Básico de Números Naturales",
            status: "completed",
            classes_count: 5,
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80"
        },
        {
            id: 2,
            title: "Curso de Suma y Resta",
            status: "in_progress",
            classes_count: 8,
            image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80"
        },
        {
            id: 3,
            title: "Curso de Multiplicación",
            status: "locked",
            classes_count: 10,
            image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80"
        },
        {
            id: 4,
            title: "Curso de División",
            status: "locked",
            classes_count: 12,
            image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80"
        }
    ]
};

export default function RutaPage() {
    const { slug } = useParams();
    const ruta = MOCK_RUTA; // In real app: fetch from Supabase

    // Badge Colors based on status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">COMPLETADO</span>;
            case 'in_progress': return <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">EN PROGRESO</span>;
            default: return <span className="bg-gray-800 text-gray-500 text-xs font-bold px-2 py-1 rounded">BLOQUEADO</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            {/* Path Header */}
            <div className="pt-32 pb-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl shadow-2xl ring-4 ring-white/5">
                            🛣️
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{ruta.name}</h1>
                            <p className="text-xl text-gray-300 mb-6">{ruta.description}</p>

                            {/* Global Progress */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 max-w-sm h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${ruta.progress}%` }} />
                                </div>
                                <span className="font-mono text-green-400">{ruta.progress}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <main className="max-w-3xl mx-auto px-4 py-16 relative">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-20 bottom-20 w-1 bg-white/10 -translate-x-1/2 hidden md:block" />

                <div className="space-y-12">
                    {ruta.courses.map((curso, index) => (
                        <div key={curso.id} className={`relative flex flex-col md:flex-row items-center gap-8 group ${curso.status === 'locked' ? 'opacity-50 grayscale' : ''}`}>

                            {/* Connector Dot (Desktop) */}
                            <div className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 items-center justify-center z-10 transition-colors ${curso.status === 'completed' ? 'bg-green-500 border-green-900' :
                                curso.status === 'in_progress' ? 'bg-blue-500 border-blue-900' : 'bg-[#0a0a0a] border-gray-700'
                                }`}>
                                {curso.status === 'completed' && <span className="text-black text-xs">✓</span>}
                            </div>

                            {/* Image Side */}
                            <div className={`flex-1 w-full md:w-auto ${index % 2 === 0 ? 'md:text-right md:order-1' : 'md:order-3'}`}>
                                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5 group-hover:scale-105 transition-transform duration-300 relative">
                                    <img src={curso.image} alt={curso.title} className="w-full h-full object-cover" />
                                    {curso.status === 'locked' && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-3xl">🔒</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spacer for Connector */}
                            <div className="hidden md:block md:order-2 w-16" />

                            {/* Content Side */}
                            <div className={`flex-1 w-full md:w-auto ${index % 2 === 0 ? 'md:text-left md:order-3' : 'md:text-right md:order-1'}`}>
                                <div className="mb-2">
                                    {getStatusBadge(curso.status)}
                                </div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                    <Link href={curso.status !== 'locked' ? `/cursos` : '#'}>
                                        {curso.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">{curso.classes_count} Clases • 2 Exámenes</p>

                                {curso.status !== 'locked' && (
                                    <Link
                                        href="/cursos"
                                        className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300"
                                    >
                                        {curso.status === 'completed' ? 'Repasar Curso' : 'Continuar Curso'} →
                                    </Link>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
