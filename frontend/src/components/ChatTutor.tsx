"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Mic, Image as ImageIcon, X, Send, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    image?: string;
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
    const [listening, setListening] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleVoice = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
            return;
        }

        if (listening) {
            // Stop listening logic if needed (usually auto-stops)
            setListening(false);
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'es-MX';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + " " + transcript);
        };

        recognition.start();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
        }
    };

    const sendMessage = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = input.trim();
        const userImage = selectedImage;

        setInput("");
        setSelectedImage(null);

        setMessages(prev => [...prev, { role: "user", content: userMessage, image: userImage || undefined }]);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3002/api/tutor/chat", { // Direct to API for demo (or via Next proxy)
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    image_url: userImage, // Pass base64 image
                    lesson_context: `Clase: ${title}. Contenido breve: ${context.substring(0, 1000)}...`,
                    history: messages.map(m => ({ role: m.role, content: m.content })).slice(-6)
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
                            {msg.image && (
                                <img src={msg.image} alt="User upload" className="max-w-full rounded-lg mb-2" />
                            )}
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
                {selectedImage && (
                    <div className="mb-2 relative inline-block">
                        <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-white/20" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div className="flex gap-2 items-end">
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors border border-white/5"
                        title="Subir imagen"
                    >
                        <ImageIcon size={20} />
                    </button>

                    <button
                        onClick={handleVoice}
                        className={`p-3 rounded-xl transition-all border border-white/5 ${listening
                                ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                            }`}
                        title="Dictar por voz"
                    >
                        <Mic size={20} />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder={listening ? "Escuchando..." : "Escribe o usa el micrófono..."}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
