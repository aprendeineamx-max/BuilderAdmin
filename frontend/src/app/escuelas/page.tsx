"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import EscuelaCard from '@/components/EscuelaCard';
import { supabase } from '@/lib/supabase';

// Mock data for immediate preview (Platzi Style)
const MOCK_ESCUELAS = [
    {
        id: 1,
        name: "Escuela de Matemáticas",
        slug: "matematicas",
        description: "Domina desde la aritmética básica hasta el cálculo avanzado con una metodología única y práctica.",
        icon: "🧮",
        color: "#3b82f6",
        rutas_count: 4
    },
    {
        id: 2,
        name: "Escuela de Lenguaje y Comunicación",
        slug: "lenguaje",
        description: "Aprende a escribir correctamente, mejora tu comprensión lectora y exprésate con claridad.",
        icon: "✍️",
        color: "#f59e0b",
        rutas_count: 3
    },
    {
        id: 3,
        name: "Escuela de Ciencias",
        slug: "ciencias",
        description: "Explora el mundo natural, la biología, la física y la química con experimentos reales.",
        icon: "🧬",
        color: "#10b981",
        rutas_count: 5
    },
    {
        id: 4,
        name: "Escuela de Habilidades Digitales",
        slug: "digital",
        description: "Entra al mundo de la tecnología: computación básica, internet y herramientas de oficina.",
        icon: "💻",
        color: "#8b5cf6",
        rutas_count: 2
    },
    {
        id: 5,
        name: "Escuela de Historia y Sociedad",
        slug: "historia",
        description: "Conoce la historia de México, civismo y geografía para entender nuestro entorno.",
        icon: "🌎",
        color: "#ef4444",
        rutas_count: 3
    },
    {
        id: 6,
        name: "Escuela de Vida y Trabajo",
        slug: "vida-trabajo",
        description: "Habilidades blandas, oficios y consejos para el desarrollo personal y profesional.",
        icon: "🚀",
        color: "#ec4899",
        rutas_count: 2
    }
];

export default function EscuelasPage() {
    const [escuelas, setEscuelas] = useState(MOCK_ESCUELAS);
    const [loading, setLoading] = useState(false); // Set to true when real fetch is enabled

    useEffect(() => {
        // Attempt to fetch real data
        const fetchEscuelas = async () => {
            try {
                const { data, error } = await supabase.from('escuelas').select('*');
                if (data && data.length > 0 && !error) {
                    // map data to match UI expected format if needed
                    setEscuelas(data as any);
                }
            } catch (e) {
                // Fallback to mock
            }
        };
        fetchEscuelas();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-400 selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-green-900/20 to-transparent pointer-events-none" />
                <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold tracking-wider mb-6 uppercase">
                        La escuela de educación básica de México
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        Todas las <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Escuelas de Conocimiento</span>
                        <br />
                        en un solo lugar
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                        No aprendas temas sueltos. Sigue rutas de aprendizaje diseñadas por expertos y nuestra IA para dominar una materia de principio a fin.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl opacity-25 group-hover:opacity-50 blur transition duration-200" />
                        <input
                            type="text"
                            placeholder="¿Qué quieres aprender hoy?"
                            className="relative w-full bg-[#121212] border border-white/10 text-white px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-lg placeholder:text-gray-600 shadow-2xl"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl grayscale opacity-50">🔍</span>
                    </div>
                </div>
            </div>

            {/* Grid of Schools */}
            <main className="max-w-7xl mx-auto px-4 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {escuelas.map((escuela) => (
                        <div key={escuela.id} className="h-full">
                            <EscuelaCard
                                name={escuela.name}
                                slug={escuela.slug}
                                description={escuela.description}
                                icon={escuela.icon || (escuela as any).icon_url}
                                color={(escuela as any).color}
                                courseCount={(escuela as any).rutas_count || 0}
                            />
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
