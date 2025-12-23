"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityLayout from "@/components/CommunityLayout";
import { MessageCircle, Heart, Share2, MoreHorizontal } from "lucide-react";

export default function CommunityPage() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "María González",
            avatar_color: "from-pink-500 to-rose-500",
            content: "¡Acabo de terminar mi primer examen de Matemáticas con 10! 💯 Nunca creí que podría hacerlo tan rápido. Gracias al Tutor AI por la ayuda.",
            time: "hace 2 horas",
            likes: 24,
            comments: 5,
            badge: "🏆 Matemáticas I"
        },
        {
            id: 2,
            author: "Carlos Rodriguez",
            avatar_color: "from-blue-500 to-cyan-500",
            content: "¿Alguien sabe cómo tramitar el certificado final una vez completada la ruta? Ya tengo el 100% en todos los módulos.",
            time: "hace 4 horas",
            likes: 8,
            comments: 12,
            badge: null
        },
        {
            id: 3,
            author: "Sistema INEA",
            avatar_color: "from-emerald-500 to-green-600",
            content: "🎉 Felicitamos a Juan Pérez por alcanzar el rango de 'Estudiante Legendario' esta semana. ¡Sigue así!",
            time: "hace 6 horas",
            likes: 156,
            comments: 43,
            badge: "🥇 Rango Legendario"
        }
    ]);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20">
                <CommunityLayout>
                    <div className="space-y-6">
                        {/* New Post Input */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0" />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="¿Qué estás pensando o estudiando hoy?"
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                <div className="flex gap-2">
                                    {/* Action icons could go here */}
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Publicar
                                </button>
                            </div>
                        </div>

                        {/* Feed */}
                        {posts.map(post => (
                            <div key={post.id} className="bg-slate-800/30 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${post.avatar_color}`} />
                                        <div>
                                            <h4 className="font-bold text-white">{post.author}</h4>
                                            <p className="text-xs text-gray-400">{post.time}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <p className="text-gray-200 mb-4 leading-relaxed">
                                    {post.content}
                                </p>

                                {post.badge && (
                                    <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 mb-4">
                                        {post.badge}
                                    </div>
                                )}

                                <div className="flex items-center gap-6 text-gray-400 text-sm">
                                    <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                                        <Heart size={18} className="group-hover:scale-110 transition-transform" />
                                        {post.likes}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                        <MessageCircle size={18} />
                                        {post.comments}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-green-400 transition-colors ml-auto">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CommunityLayout>
            </main>

            <Footer />
        </div>
    );
}
