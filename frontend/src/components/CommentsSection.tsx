"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    parent_id: number | null;
    profiles: {
        full_name: string;
        avatar_url: string;
    };
    replies?: Comment[];
}

export default function CommentsSection({ claseId }: { claseId: number }) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [claseId]);

    const fetchComments = async () => {
        // Determine the ID colum type based on your schema. Assuming 'clases_generadas.id' is bigint (number).
        // The query fetches all comments for this class
        const { data, error } = await supabase
            .from("comments")
            .select(`
        *,
        profiles (full_name, avatar_url)
      `)
            .eq("clase_id", claseId)
            .order("created_at", { ascending: true }); // We sort internally by parent

        if (error) {
            console.error("Error fetching comments:", error);
        } else if (data) {
            // Reconstruct tree
            const rootComments: Comment[] = [];
            const replyMap = new Map<number, Comment[]>();

            data.forEach((c: any) => {
                if (c.parent_id) {
                    if (!replyMap.has(c.parent_id)) replyMap.set(c.parent_id, []);
                    replyMap.get(c.parent_id)?.push(c);
                } else {
                    rootComments.push(c);
                }
            });

            // Attach replies
            rootComments.forEach(c => {
                c.replies = replyMap.get(c.id) || [];
            });

            setComments(rootComments.reverse()); // Show newest threads first
        }
    };

    const handleSubmit = async (parentId: number | null = null) => {
        if (!user || !newComment.trim()) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.from("comments").insert({
                clase_id: claseId,
                user_id: user.id,
                content: newComment,
                parent_id: parentId
            });

            if (error) throw error;

            setNewComment("");
            setReplyTo(null);
            fetchComments(); // Refresh list
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <div className={`flex gap-3 mb-6 ${isReply ? "ml-12 mt-4" : ""}`}>
            {/* Avatar */}
            <div className={`rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-white font-bold
         ${isReply ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"}
      `}>
                {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} alt="avatar" className="w-full h-full rounded-full" />
                ) : (
                    comment.profiles?.full_name?.charAt(0) || "?"
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm">
                            {comment.profiles?.full_name || "Usuario Anónimo"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Actions */}
                {!isReply && (
                    <div className="flex gap-4 mt-2 ml-2">
                        <button
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            className="text-xs text-gray-500 hover:text-blue-400 font-medium transition-colors"
                        >
                            Responder
                        </button>
                    </div>
                )}

                {/* Reply Input */}
                {replyTo === comment.id && !isReply && (
                    <div className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            autoFocus
                            placeholder="Escribe una respuesta..."
                            className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        />
                        <button
                            onClick={() => handleSubmit(comment.id)}
                            disabled={isLoading}
                            className="bg-blue-600 px-4 py-2 rounded-lg text-sm text-white hover:bg-blue-500"
                        >
                            Enviar
                        </button>
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies?.map(reply => (
                    <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                💬 Discusión de la Clase
            </h3>

            {user ? (
                <div className="mb-10 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {user.user_metadata?.full_name?.charAt(0) || "Y"}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={replyTo ? "" : newComment}
                            onChange={(e) => {
                                if (!replyTo) setNewComment(e.target.value);
                            }}
                            placeholder="Aporta algo a la clase o haz una pregunta..."
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none resize-none h-24"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={() => handleSubmit(null)}
                                disabled={isLoading || (!replyTo && !newComment.trim())}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                {isLoading ? "Publicando..." : "Publicar Comentario"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-6 text-center mb-8">
                    <p className="text-blue-200">🚀 Inicia sesión para unirte a la discusión y compartir tus dudas.</p>
                </div>
            )}

            {/* List */}
            <div className="space-y-2">
                {comments.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Sé el primero en comentar esta clase.</p>
                ) : (
                    comments.map(c => <CommentItem key={c.id} comment={c} />)
                )}
            </div>
        </div>
    );
}
