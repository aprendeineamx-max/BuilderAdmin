"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ExamRunner from "@/components/ExamRunner";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function ExamenPage({ params }: { params: { id: string } }) {
    const [exam, setExam] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        loadExam();
    }, []);

    const loadExam = async () => {
        // DEMO: We fetch the seeded exam "Certificación Primaria" if ID matches or just first one
        // For robustness in this demo phase, we will fetch specifically the one we just seeded
        try {
            // 1. Get Exam Metadata
            const { data: examData } = await supabase
                .from('exams')
                .select('*')
                .eq('title', 'Certificación Primaria - Matemáticas')
                .limit(1)
                .single();

            if (examData) {
                setExam(examData);

                // 2. Get Questions & Options
                const { data: qData } = await supabase
                    .from('exam_questions')
                    .select('*, options:exam_options(*)')
                    .eq('exam_id', examData.id)
                    .order('order_index');

                if (qData) {
                    setQuestions(qData);
                }
            } else {
                // Fallback if DB fetch fails (Manual Mock for immediate Verify)
                setExam({ title: 'Simulacro de Examen', time_limit_minutes: 30 });
                setQuestions([
                    {
                        id: '1', question_text: '¿Capital de México?', question_type: 'multiple_choice', points: 10,
                        options: [{ id: 'a', label: 'CDMX' }, { id: 'b', label: 'Guadalajara' }]
                    },
                    {
                        id: '2', question_text: '2+2 = 4', question_type: 'boolean', points: 10,
                        options: [{ id: 't', label: 'Verdadero' }, { id: 'f', label: 'Falso' }]
                    }
                ]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = (score: number, answers: any) => {
        // Here we would submit to backend
        // For demo, we just show "Thinking..." then Result
        setLoading(true);
        setTimeout(() => {
            setResult({ score: 85, passed: true }); // Mock result
            setLoading(false);
        }, 1500);
    };

    if (loading && !result) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                <p className="text-xl font-bold ml-4">Cargando Examen...</p>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-white/10 text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/10">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">¡Examen Completado!</h1>
                    <p className="text-gray-400 mb-8">Has demostrado tu conocimiento.</p>

                    <div className="bg-slate-700/50 rounded-xl p-6 mb-8">
                        <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Calificación Final</span>
                        <span className="text-5xl font-bold text-green-400">{result.score}/100</span>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold">
                        Ver Respuestas Correctas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 px-4">
                {exam && (
                    <ExamRunner
                        examTitle={exam.title}
                        timeLimitMinutes={exam.time_limit_minutes || 60}
                        questions={questions}
                        onComplete={handleComplete}
                    />
                )}
            </main>
        </div>
    );
}
