"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Card, Avatar } from "@/components/ui";

export default function LivePage() {
    const { user } = useAuth();
    const [liveEvent, setLiveEvent] = useState<any>(null);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchEvents();

        // Subscription for new events
        const eventSub = supabase
            .channel('public:events')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
                fetchEvents();
            })
            .subscribe();

        return () => { supabase.removeChannel(eventSub); }
    }, []);

    useEffect(() => {
        if (liveEvent) {
            fetchChat(liveEvent.id);
            const chatSub = supabase
                .channel(`event_chat:${liveEvent.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_chat_messages', filter: `event_id=eq.${liveEvent.id}` }, payload => {
                    fetchNewMessage(payload.new.id);
                })
                .subscribe();
            return () => { supabase.removeChannel(chatSub); }
        }
    }, [liveEvent]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const fetchEvents = async () => {
        try {
            // Get Live
            const { data: live } = await supabase
                .from('events')
                .select('*')
                .eq('status', 'live')
                .maybeSingle(); // Use maybeSingle to avoid 406 if multiple (should be one) or null

            setLiveEvent(live);

            // Get Scheduled
            const { data: scheduled } = await supabase
                .from('events')
                .select('*')
                .eq('status', 'scheduled')
                .order('start_time', { ascending: true });

            if (scheduled) setSchedule(scheduled);
        } finally {
            setLoading(false);
        }
    };

    const fetchChat = async (eventId: number) => {
        const { data } = await supabase
            .from('event_chat_messages')
            .select('*, profiles:user_id(username, avatar_url)')
            .eq('event_id', eventId)
            .order('created_at', { ascending: true })
            .limit(100);

        if (data) setChatMessages(data);
    };

    const fetchNewMessage = async (msgId: number) => {
        const { data } = await supabase
            .from('event_chat_messages')
            .select('*, profiles:user_id(username, avatar_url)')
            .eq('id', msgId)
            .single();

        if (data) setChatMessages(prev => [...prev, data]);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !liveEvent) return;

        await supabase.from('event_chat_messages').insert({
            event_id: liveEvent.id,
            user_id: user.id,
            message: newMessage.trim()
        });
        setNewMessage("");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold tracking-wider mb-4 uppercase animate-pulse">
                        🔴 Transmisión En Vivo
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Auditorio Virtual</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Participa en clases maestras en tiempo real, interactúa con instructores y resuelve tus dudas al instante.
                    </p>
                </div>

                {/* Main Stage (If Live) */}
                {loading ? (
                    <div className="h-96 w-full bg-slate-800 rounded-3xl animate-pulse mb-12" />
                ) : liveEvent ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {/* Video Player */}
                        <div className="lg:col-span-2">
                            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20 border border-white/10 group">
                                <iframe
                                    src={`https://www.youtube.com/embed/${liveEvent.stream_url}?autoplay=1`}
                                    className="w-full h-full"
                                    title={liveEvent.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="mt-6">
                                <h2 className="text-2xl font-bold mb-2">{liveEvent.title}</h2>
                                <p className="text-gray-400">{liveEvent.description}</p>
                            </div>
                        </div>

                        {/* Live Chat */}
                        <div className="h-[600px] flex flex-col bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
                                <h3 className="font-bold flex items-center gap-2">
                                    💬 Chat en Vivo
                                    <span className="text-xs font-normal text-gray-500">• {chatMessages.length} mensajes</span>
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0f0f0f]">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className="flex gap-3 animate-slide-in">
                                        <div className="flex-shrink-0 mt-1">
                                            <Avatar name={msg.profiles?.username || "A"} size="sm" />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-bold text-gray-300">{msg.profiles?.username || "Usuario"}</span>
                                                <span className="text-[10px] text-gray-600">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-white/10 bg-slate-900">
                                {user ? (
                                    <form onSubmit={sendMessage} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            placeholder="Escribe algo..."
                                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                        <Button variant="primary" size="sm" type="submit" disabled={!newMessage.trim()}>Envíar</Button>
                                    </form>
                                ) : (
                                    <div className="text-center text-sm text-gray-500 py-2">
                                        <a href="/login" className="text-blue-400 hover:underline">Inicia sesión</a> para chatear.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-white/5 mb-16">
                        <div className="text-6xl mb-6">😴</div>
                        <h2 className="text-2xl font-bold mb-2">No hay transmisiones ahora</h2>
                        <p className="text-gray-400">Revisa la cartelera abajo para ver los próximos eventos.</p>
                    </div>
                )}

                {/* Upcoming Schedule */}
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        📅 Próximos Eventos
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {schedule.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
