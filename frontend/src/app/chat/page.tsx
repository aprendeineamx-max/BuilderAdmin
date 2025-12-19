"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "¡Hola! 👋 Soy Profe INEA, tu tutor virtual. Estoy aquí para ayudarte con cualquier duda sobre matemáticas, lectura, ciencias o cualquier otro tema. ¿En qué puedo ayudarte hoy?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [lessonContext, setLessonContext] = useState("general");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // Call Chat Tutor API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    lesson_context: lessonContext,
                    history: messages.slice(-6)
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "Lo siento, hubo un problema. ¿Puedes intentar de nuevo?"
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Parece que hay un problema de conexión. Inténtalo más tarde."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-white font-bold text-xl">INEA.mx</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/cursos" className="text-gray-300 hover:text-white transition-colors">
                                Cursos
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chat Container */}
            <div className="pt-20 pb-4 px-4 max-w-4xl mx-auto h-screen flex flex-col">
                {/* Chat Header */}
                <div className="bg-slate-800/50 rounded-t-2xl border border-white/10 border-b-0 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <div>
                                <div className="text-white font-semibold">Profe INEA</div>
                                <div className="text-emerald-400 text-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    En línea - Respuestas instantáneas
                                </div>
                            </div>
                        </div>
                        <select
                            value={lessonContext}
                            onChange={(e) => setLessonContext(e.target.value)}
                            className="bg-slate-700 text-gray-300 rounded-lg px-3 py-2 text-sm border border-white/10"
                        >
                            <option value="general">Tema General</option>
                            <option value="matematicas">Matemáticas</option>
                            <option value="fracciones">Fracciones</option>
                            <option value="lectura">Lectura y Escritura</option>
                            <option value="ciencias">Ciencias</option>
                            <option value="historia">Historia de México</option>
                        </select>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 bg-slate-800/30 border-x border-white/10 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === "user"
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-slate-700 text-gray-200 rounded-bl-none"
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-700 text-gray-200 px-4 py-3 rounded-2xl rounded-bl-none">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="bg-slate-800/50 rounded-b-2xl border border-white/10 border-t-0 p-4">
                    <div className="flex gap-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Escribe tu pregunta aquí..."
                            className="flex-1 bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            rows={1}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Enviar
                        </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 text-center">
                        💡 Tip: Puedes preguntar sobre cualquier tema de primaria o secundaria
                    </p>
                </div>
            </div>
        </div>
    );
}
