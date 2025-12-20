"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Card, Badge, Skeleton, Toast } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function ClasePage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();

    const [clase, setClase] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [markedLoading, setMarkedLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (id) {
            fetchClase();
            if (user) checkProgress();
        }
    }, [id, user]);

    const fetchClase = async () => {
        try {
            const { data, error } = await supabase
                .from("clases_generadas")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            setClase(data);
        } catch (error) {
            console.error("Error fetching class:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkProgress = async () => {
        try {
            const { data } = await supabase
                .from("clases_progreso")
                .select("completado")
                .eq("clase_id", id)
                .eq("user_id", user?.id)
                .single();

            if (data?.completado) setCompleted(true);
        } catch (error) {
            // console.error(error); 
        }
    };

    const markCompleted = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        // Simple confetti effect logic could go here
    } catch (error) {
        console.error("Error marking complete:", error);
        setToast({ message: "Error al guardar progreso", type: "error" });
    } finally {
        setMarkedLoading(false);
    }
};

if (loading) {
    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </main>
        </div>
    );
}

if (!clase) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
            Clase no encontrada
        </div>
    );
}

return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
        <Navbar />

        <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Badge variant="info">Clase</Badge>
                    <span className="text-sm text-gray-400">ID: {clase.id}</span>
                    {completed && <Badge variant="success">✅ Completada</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{clase.tema}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📅 {new Date(clase.created_at).toLocaleDateString()}</span>
                    <span>⏱️ 15 min lectura</span>
                </div>
            </div>

            <Card className="p-8 mb-8 prose prose-invert max-w-none">
                <ReactMarkdown>{clase.contenido}</ReactMarkdown>
            </Card>

            {/* Action Area */}
            <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                <div>
                    <h3 className="text-white font-semibold">¿Terminaste la lección?</h3>
                    <p className="text-sm text-gray-400">Marca tu progreso para obtener tu certificado.</p>
                </div>

                {completed ? (
                    <Button disabled className="bg-emerald-500/20 text-emerald-400 cursor-default border border-emerald-500/50">
                        ¡Completada!
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={markCompleted}
                        disabled={markedLoading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20"
                    >
                        {markedLoading ? "Guardando..." : "✅ Marcar como Terminada"}
                    </Button>
                )}
            </div>

            {/* Next Steps */}
            {completed && (
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-gray-400 mb-4">¿Tienes dudas sobre este tema?</p>
                    <Button variant="outline" onClick={() => router.push(`/chat?context=${clase.id}`)}>
                        💬 Preguntar al Tutor IA
                    </Button>
                </div>
            )}

        </main>

        <Footer />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
);
}
