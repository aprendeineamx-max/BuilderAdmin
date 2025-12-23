"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LearningPathMap from "@/components/LearningPathMap";
import { supabase } from "@/lib/supabase";

export default function RutaPage({ params }: { params: { slug: string } }) {
    const [path, setPath] = useState<any>(null);
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPath();
    }, []);

    const loadPath = async () => {
        // FOR DISPLAY DEMO: Force Mock Data immediately to avoid DB Latency/Empty issues
        // We will uncomment the DB logic once Phase 13 is fully integrated with Admin Panel
        setTimeout(() => {
            setPath({
                title: 'Primaria Express',
                description: 'Ruta certificada por INEA para terminar tu primaria.',
            });
            setNodes([
                { id: '1', title: 'Fundamentos de Lectura', description: 'Aprende las vocales y consonantes básicas.', step_order: 1, node_type: 'course', is_completed: true, is_locked: false, curso_id: 110 },
                { id: '2', title: 'Matemáticas Básicas', description: 'Sumas y restas con objetos cotidianos.', step_order: 2, node_type: 'course', is_completed: true, is_locked: false, curso_id: 104 },
                { id: '3', title: 'Historia de México I', description: 'Nuestros orígenes prehispánicos.', step_order: 3, node_type: 'course', is_completed: false, is_locked: false, curso_id: 108 },
                { id: '4', title: 'Ciencias Naturales', description: 'El cuerpo humano y la salud.', step_order: 4, node_type: 'course', is_completed: false, is_locked: true, curso_id: 112 },
                { id: '5', title: 'Examen Parcial', description: 'Demuestra lo que has aprendido.', step_order: 5, node_type: 'quiz', is_completed: false, is_locked: true },
                { id: '6', title: 'Civismo y Ética', description: 'Valores para la vida en comunidad.', step_order: 6, node_type: 'course', is_completed: false, is_locked: true, curso_id: 115 },
                { id: '7', title: 'Graduación', description: 'Obtén tu certificado oficial.', step_order: 7, node_type: 'milestone', is_completed: false, is_locked: true },
            ]);
            setLoading(false);
        }, 500);

        /* 
        try {
            const { data: pathData } = await supabase
                .from('learning_paths')
                .select('*')
                .eq('slug', 'primaria-express')
                .single();

            if (pathData) {
                setPath(pathData);
                // ... fetch nodes ...
            }
        } catch (e) { console.error(e); } 
        */
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-12">
                {loading ? (
                    <div className="text-center pt-20">Cargando Mapa...</div>
                ) : (
                    path && <LearningPathMap pathTitle={path.title} nodes={nodes} currentStepIndex={1} />
                )}
            </main>
            <Footer />
        </div>
    );
}
