"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button, Card, Badge } from "@/components/ui";

interface GlossaryTerm {
    id: number;
    term: string;
    definition: string;
    likes_count: number;
}

export default function GlossaryWidget({ claseId }: { claseId: number }) {
    const { user } = useAuth();
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTerm, setNewTerm] = useState({ term: "", definition: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTerms();
    }, [claseId]);

    const fetchTerms = async () => {
        const { data, error } = await supabase
            .from("glossary_terms")
            .select("*")
            .eq("clase_id", claseId)
            .order("likes_count", { ascending: false });

        if (data) setTerms(data);
    };

    const handleAddTerm = async () => {
        if (!newTerm.term || !newTerm.definition) return;
        setLoading(true);
        try {
            const { error } = await supabase.from("glossary_terms").insert({
                clase_id: claseId,
                user_id: user?.id,
                term: newTerm.term,
                definition: newTerm.definition
            });

            if (error) throw error;

            setNewTerm({ term: "", definition: "" });
            setIsAdding(false);
            fetchTerms();
        } catch (error) {
            console.error("Error adding term:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-full flex flex-col bg-slate-900 border-none shadow-none text-white">
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-sm font-bold text-gray-400">📖 Glosario Colaborativo</span>
                <Button variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? "✕" : "+ Añadir"}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-slate-800 p-3 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
                    <input
                        className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 mb-2 text-sm"
                        placeholder="Término (ej. Hipotenusa)"
                        value={newTerm.term}
                        onChange={e => setNewTerm({ ...newTerm, term: e.target.value })}
                    />
                    <textarea
                        className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 mb-2 text-sm h-16 resize-none"
                        placeholder="Definición..."
                        value={newTerm.definition}
                        onChange={e => setNewTerm({ ...newTerm, definition: e.target.value })}
                    />
                    <Button variant="primary" size="sm" className="w-full" onClick={handleAddTerm} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Término"}
                    </Button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {terms.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 text-sm">
                        No hay términos aún.<br />¡Sé el primero en definir algo!
                    </div>
                ) : (
                    terms.map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-emerald-400 text-sm">{item.term}</span>
                                <Badge variant="default" className="text-[10px] py-0 px-1 bg-white/10">{item.likes_count} 👍</Badge>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{item.definition}</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
