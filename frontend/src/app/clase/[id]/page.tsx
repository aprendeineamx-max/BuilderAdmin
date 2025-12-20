"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge, Skeleton, Toast } from "@/components/ui";
import ChatTutor from "@/components/ChatTutor";
import CommentsSection from "@/components/CommentsSection";
import ContributionsSection from "@/components/ContributionsSection";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import NotesPanel from "@/components/NotesPanel";
import GlossaryWidget from "@/components/GlossaryWidget";
import BadgeNotification from "@/components/BadgeNotification";

export default function ClasePage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();

    const [clase, setClase] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [markedLoading, setMarkedLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [activeTab, setActiveTab] = useState<'tutor' | 'notes' | 'glossary'>('tutor');
    const [showBadge, setShowBadge] = useState(false);

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
                .eq("clase_id", parseInt(id as string))
                .eq("user_id", user?.id)
                .single();

            if (data?.completado) setCompleted(true);
        } catch (error) {
            // Ignore error if not found
        }
    };

    const markCompleted = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        setMarkedLoading(true);
        try {
            // 1. Mark Progress
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

            // 2. Update Streak (Gamification) RPC Call
            // Note: If update_user_streak function fails or doesn't exist, we just catch it.
            try {
                await supabase.rpc('update_user_streak', { target_user_id: user.id });
            } catch (rpcError) {
                console.warn("Gamification RPC failed (might be dev env):", rpcError);
            }

            setCompleted(true);
            setToast({ message: "¡Felicidades! Lección completada +100 XP", type: "success" });

            // 3. Trigger Celebration
            setShowBadge(true);

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
            <BadgeNotification
                title="¡Racha Aumentada!"
                message="Estás en camino a la grandeza. Sigue así."
                trigger={showBadge}
            />

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
                                </button>
                            )}
                        </div>

                        {/* Social Learning: Student Contributions */}
                        <ContributionsSection claseId={clase.id} />

                        {/* Social Learning: Threaded Comments */}
                        <CommentsSection claseId={clase.id} />

                        {/* Use Default Footer Export if available, else just render component */}
                        <Footer />
                    </div>
                </div>

                {/* Right Column: Tools Panel (Sticky on Desktop) */}
                <div className="hidden lg:col-span-4 lg:flex flex-col h-full pt-2">
                    <div className="h-full sticky top-24 bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">

                        {/* Tab Headers */}
                        <div className="flex border-b border-white/10">
                            {[
                                { id: 'tutor', label: '🤖 Tutor IA' },
                                { id: 'notes', label: '📝 Notas' },
                                { id: 'glossary', label: '📖 Glosario' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-hidden relative">
                            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'tutor' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                <ChatTutor
                                    title={clase.tema}
                                    context={clase.contenido}
                                    className="h-full shadow-none border-none bg-transparent"
                                />
                            </div>
                            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'notes' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                {activeTab === 'notes' && <NotesPanel claseId={clase.id} />}
                            </div>
                            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'glossary' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                {activeTab === 'glossary' && <GlossaryWidget claseId={clase.id} />}
                            </div>
                        </div>
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
