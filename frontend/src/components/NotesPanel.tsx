"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui";

export default function NotesPanel({ claseId }: { claseId: number }) {
    const { user } = useAuth();
    const [note, setNote] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (user) {
            fetchNote();
        }
    }, [user, claseId]);

    const fetchNote = async () => {
        const { data, error } = await supabase
            .from("personal_notes")
            .select("content")
            .eq("user_id", user?.id)
            .eq("clase_id", claseId)
            .single();

        if (data) {
            setNote(data.content);
        } else {
            setNote(""); // Default empty
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setNote(newValue);
        setStatus("idle");

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            saveNote(newValue);
        }, 1000); // Debounce 1s
    };

    const saveNote = async (content: string) => {
        if (!user) return;
        setStatus("saving");

        // Upsert logic
        const { error } = await supabase
            .from("personal_notes")
            .upsert({
                user_id: user.id,
                clase_id: claseId,
                content: content,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, clase_id' });

        if (error) {
            console.error("Error saving note:", error);
            setStatus("error");
        } else {
            setStatus("saved");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <Card className="h-full flex flex-col bg-slate-900 border-none shadow-none">
            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm font-bold text-gray-400">📝 Mis Notas Personales</span>
                {status === "saving" && <span className="text-xs text-yellow-500">Guardando...</span>}
                {status === "saved" && <span className="text-xs text-green-500">✅ Guardado</span>}
                {status === "error" && <span className="text-xs text-red-500">❌ Error</span>}
            </div>
            <textarea
                className="flex-1 w-full bg-[#1e1e1e] border-none text-gray-300 p-4 resize-none focus:ring-0 rounded-xl font-mono text-sm leading-relaxed custom-scrollbar"
                placeholder="Escribe aquí tus apuntes de la clase... (Se guardan automáticamente)"
                value={note}
                onChange={handleInput}
                spellCheck={false}
            />
        </Card>
    );
}
