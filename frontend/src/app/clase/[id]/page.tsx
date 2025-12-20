"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Card, Badge, Skeleton, Toast } from "@/components/ui";
import ChatTutor from "@/components/ChatTutor"; // Import new widget
import CommentsSection from "@/components/CommentsSection"; // Phase 14: Social
import ContributionsSection from "@/components/ContributionsSection"; // Phase 14 Part 2
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
    const [showMobileChat, setShowMobileChat] = useState(false); // Mobile chat toggle

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
                .eq("clase_id", parseInt(id as string)) // Safe cast
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

        setMarkedLoading(true);
        try {
            const { error } = await supabase
                .from("clases_progreso")
                .upsert({
                    user_id: user.id,
                    clase_id: parseInt(id as string),
                    completado: true,
                    calificacion: 100,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, clase_id' });

            if (error) throw error;

            setCompleted(true);
            setToast({ message: "¡Felicidades! Clase completada +100 XP", type: "success" });
        } catch (error) {
            console.error("Error marking complete:", error);
            setToast({ message: "Error al guardar progreso", type: "error" });
        } finally {
            setMarkedLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col">
                <Navbar />
                <main className="flex-1 pt-24 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </main>
            </div>
        );
    }

    if (!clase) return <div className="text-white text-center pt-32">Clase no encontrada</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
            <Navbar />

            {/* Main Layout: Split Screen on Desktop */}
            <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-6rem)]">

                {/* Left Column: Content (Scrollable) */}
                <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Header */}
                        <div className="mb-8 ">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="info" className="uppercase tracking-wider text-xs">Módulo Educativo</Badge>
                                <span className="text-xs text-slate-400 font-mono">ID: {clase.id}</span>
                                {completed && <Badge variant="success">✅ Completada</Badge>}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{clase.tema}</h1>
                            <div className="flex items-center gap-6 text-sm text-slate-400 border-b border-white/5 pb-6">
                                <span className="flex items-center gap-2">📅 {new Date(clase.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2">⏱️ 15 min lectura</span>
                                <span className="flex items-center gap-2">👤 Nivel {clase.modelo || 'Básico'}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <Card className="p-8 md:p-10 mb-8 prose prose-invert max-w-none prose-lg bg-slate-800/20 border-white/5 shadow-none">
                            <ReactMarkdown>{clase.contenido}</ReactMarkdown>
                        </Card>

                        {/* Completion Area */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-slate-800 to-slate-800/50 p-8 rounded-3xl border border-white/10 mb-12">
                            <div className="mb-4 sm:mb-0">
                                <h3 className="text-white font-bold text-lg mb-1">¿Terminaste la lección?</h3>
                                <p className="text-gray-400 text-sm">Registra tu avance para obtener certificados.</p>
                            </div>

                            {completed ? (
                                <button disabled className="px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 font-medium cursor-default flex items-center gap-2">
                                    <span>✅</span> Lección Completada
                                </button>
                            ) : (
                                <button
                                    onClick={markCompleted}
                                    disabled={markedLoading}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
                                >
                                    {markedLoading ? "Guardando..." : "Marcar como Terminada"}
                            )}
                                </div>

                        {/* Social Learning: Student Contributions */}
                            <ContributionsSection claseId={clase.id} />

                            {/* Social Learning: Threaded Comments */}
                            <CommentsSection claseId={clase.id} />

                            <Footer />
                        </div>
                    </div>

                    {/* Right Column: AI Tutor Widget (Sticky on Desktop) */}
                    <div className="hidden lg:col-span-4 lg:flex flex-col h-full pt-2">
                        <div className="h-full sticky top-0">
                            <ChatTutor
                                title={clase.tema}
                                context={clase.contenido}
                                className="h-[calc(100vh-8rem)] shadow-2xl shadow-black/50"
                            />
                        </div>
                    </div>

            </main >

            {/* Mobile Chat Toggle (Floating Button) */}
            < div className="lg:hidden fixed bottom-6 right-6 z-50" >
                <button
                    onClick={() => setShowMobileChat(!showMobileChat)}
                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-xl flex items-center justify-center text-2xl text-white border border-white/20"
                >
                    {showMobileChat ? '✕' : '💬'}
                </button>
            </div >

            {/* Mobile Chat Drawer */}
            {
                showMobileChat && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/90 backdrop-blur-sm pt-20 px-4 pb-20 fade-in">
                        <ChatTutor
                            title={clase.tema}
                            context={clase.contenido}
                            className="h-full shadow-2xl"
                        />
                    </div>
                )
            }

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div >
    );
}
