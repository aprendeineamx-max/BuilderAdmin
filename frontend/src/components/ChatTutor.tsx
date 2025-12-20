"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatTutorProps {
    context: string;
    title: string;
    className?: string;
}

export default function ChatTutor({ context, title, className = "" }: ChatTutorProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `¡Hola! Soy tu tutor de **${title}**. 🤖\n\nEstoy analizando el contenido de esta lección para ayudarte. ¿Qué duda tienes?`
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    // Pass the specific class context to the AI
                    lesson_context: `Clase: ${title}. Contenido breve: ${context.substring(0, 1000)}...`,
                    history: messages.slice(-6)
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                throw new Error(data.error || "Error desconocido");
            }
        } catch (e) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "😵 Lo siento, perdí la conexión un momento. ¿Me lo repites?"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-slate-900/50 p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-xl">
                    🤖
                </div>
                <div>
                    <h3 className="font-semibold text-white text-sm">Tutor IA - {title}</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        En línea
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user"
                                ? "bg-blue-600 text-white rounded-br-sm shadow-lg shadow-blue-500/10"
                                : "bg-slate-700 text-slate-100 rounded-bl-sm border border-white/5"
                            }`}>
                            <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/30 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Pregunta algo sobre la clase..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
