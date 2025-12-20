"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Avatar, Button, Card, Badge } from "@/components/ui";
import ReactMarkdown from "react-markdown";

interface Contribution {
    id: number;
    title: string;
    content: string; // Markdown
    created_at: string;
    user_id: string;
    likes_count: number;
    profiles: {
        full_name: string;
        username: string;
        avatar_url: string;
    };
}

export default function ContributionsSection({ claseId }: { claseId: number }) {
    const { user } = useAuth();
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContributions();
    }, [claseId]);

    const fetchContributions = async () => {
        const { data, error } = await supabase
            .from("contributions")
            .select(`
                *,
                profiles (full_name, username, avatar_url)
            `)
            .eq("clase_id", claseId)
            .order("likes_count", { ascending: false });

        if (data) setContributions(data);
    };

    const handlePublish = async () => {
        if (!formData.title || !formData.content) return;
        setLoading(true);
        try {
            const { error } = await supabase.from("contributions").insert({
                clase_id: claseId,
                user_id: user?.id,
                title: formData.title,
                content: formData.content
            });

            if (error) throw error;

            setFormData({ title: "", content: "" });
            setIsCreating(false);
            fetchContributions();
        } catch (error) {
            console.error("Error publishing contribution:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 border-t border-white/10 pt-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        💡 Aportes de la Comunidad
                    </h3>
                    <p className="text-sm text-gray-400">Tutoriales, resúmenes y ejemplos creados por estudiantes.</p>
                </div>
                {user && !isCreating && (
                    <Button variant="secondary" onClick={() => setIsCreating(true)}>
                        + Crear Aporte
                    </Button>
                )}
            </div>

            {isCreating && (
                <Card className="mb-8 border-none bg-slate-800/50">
                    <h4 className="font-bold text-white mb-4">Nuevo Aporte</h4>
                    <input
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-3"
                        placeholder="Título descriptivo (ej. 'Resumen de la regla de tres')"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                    <textarea
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white min-h-[150px] mb-3 font-mono text-sm"
                        placeholder="Escribe tu aporte en Markdown..."
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={handlePublish} disabled={loading}>
                            {loading ? "Publicando..." : "Publicar Aporte"}
                        </Button>
                    </div>
                </Card>
            )}

            <div className="space-y-4">
                {contributions.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                        <p className="text-gray-500">Aún no hay aportes destacados.</p>
                        <p className="text-sm text-gray-600">¡Sé el primero en compartir tu conocimiento!</p>
                    </div>
                ) : (
                    contributions.map(contribution => (
                        <div key={contribution.id} className="bg-slate-800/20 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar name={contribution.profiles?.full_name || "U"} size="sm" />
                                <div>
                                    <div className="font-bold text-sm text-white">{contribution.profiles?.full_name}</div>
                                    <div className="text-xs text-gray-400">@{contribution.profiles?.username}</div>
                                </div>
                                <div className="ml-auto">
                                    <Badge variant="success">+{contribution.likes_count} 💚</Badge>
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-blue-300 mb-2">{contribution.title}</h4>
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 line-clamp-3">
                                <ReactMarkdown>{contribution.content}</ReactMarkdown>
                            </div>

                            <Button variant="ghost" size="sm" className="mt-4 text-blue-400 hover:text-blue-300 px-0">
                                Leer completo →
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
