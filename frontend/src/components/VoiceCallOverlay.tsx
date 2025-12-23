"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneOff, Mic, MicOff } from "lucide-react";

interface VoiceCallOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    context: string;
    title: string;
}

export default function VoiceCallOverlay({ isOpen, onClose, context, title }: VoiceCallOverlayProps) {
    const [status, setStatus] = useState<"connecting" | "listening" | "thinking" | "speaking">("connecting");
    const [transcript, setTranscript] = useState("");

    // Refs for API and State
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isComponentMounted = useRef(false);

    useEffect(() => {
        isComponentMounted.current = true;

        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis;
        }

        if (isOpen) {
            startCall();
        } else {
            stopCall();
        }

        return () => {
            isComponentMounted.current = false;
            stopCall();
        };
    }, [isOpen]);

    const startCall = () => {
        setStatus("listening");

        if (!('webkitSpeechRecognition' in window)) {
            alert("Tu navegador no soporta llamadas de voz. Usa Chrome.");
            onClose();
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'es-MX';
        recognition.continuous = false; // We restart manually to control flow
        recognition.interimResults = false;

        recognition.onstart = () => {
            if (isComponentMounted.current && status !== "speaking") setStatus("listening");
        };

        recognition.onresult = async (event: any) => {
            const text = event.results[0][0].transcript;
            if (!text.trim()) return;

            setStatus("thinking");
            setTranscript(text);

            // Process with AI
            await processResponse(text);
        };

        recognition.onerror = (e: any) => {
            console.error("Speech error", e);
            if (e.error === 'no-speech') {
                // Just restart if silent
                try { recognition.start(); } catch { }
            }
        };

        recognition.onend = () => {
            // If we are not speaking and not closed, restart listening
            if (isComponentMounted.current && status !== "speaking" && status !== "thinking") {
                try { recognition.start(); } catch { }
            }
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch (e) {
            console.log("Recognition start error", e);
        }
    };

    const stopCall = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
        }
    };

    const processResponse = async (text: string) => {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    lesson_context: `Estás en una LLAMADA DE VOZ con el estudiante sobre: ${title}. ${context.substring(0, 500)}. Sé muy breve y conversacional.`,
                    history: []
                })
            });

            const data = await response.json();
            if (data.success) {
                speakResponse(data.response);
            } else {
                speakResponse("Lo siento, hubo un error. ¿Puedes repetir?");
            }
        } catch (e) {
            speakResponse("Perdí la conexión. Intenta de nuevo.");
        }
    };

    const speakResponse = (text: string) => {
        if (!synthesisRef.current) return;

        setStatus("speaking");
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-MX";
        utterance.rate = 1.0;

        utterance.onend = () => {
            if (isComponentMounted.current) {
                setStatus("listening");
                // Restart listening
                try { recognitionRef.current?.start(); } catch { }
            }
        };

        synthesisRef.current.speak(utterance);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Visualizer Circle */}
            <div className="relative mb-12">
                <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500
                    ${status === 'listening' ? 'bg-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.3)] scale-100' : ''}
                    ${status === 'speaking' ? 'bg-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)] scale-110 animate-pulse' : ''}
                    ${status === 'thinking' ? 'bg-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.3)] scale-95' : ''}
                `}>
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors duration-300
                         ${status === 'listening' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : ''}
                         ${status === 'speaking' ? 'bg-gradient-to-br from-emerald-400 to-teal-600' : ''}
                         ${status === 'thinking' ? 'bg-gradient-to-br from-purple-500 to-pink-600' : ''}
                    `}>
                        {status === 'listening' && <Mic size={48} className="text-white" />}
                        {status === 'speaking' && <div className="space-y-1">
                            <div className="w-12 h-1.5 bg-white/80 rounded-full animate-[bounce_1s_infinite_100ms]" />
                            <div className="w-8 h-1.5 bg-white/80 rounded-full mx-auto animate-[bounce_1s_infinite_300ms]" />
                        </div>}
                        {status === 'thinking' && <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />}
                    </div>
                </div>

                {/* Status Text */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 text-center">
                    <p className="text-xl font-medium text-white mb-2">
                        {status === 'listening' && "Te escucho..."}
                        {status === 'thinking' && "Pensando..."}
                        {status === 'speaking' && "Tutor Hablando..."}
                    </p>
                    {transcript && status === 'thinking' && (
                        <p className="text-sm text-gray-400 truncate">"{transcript}"</p>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex gap-6">
                <button
                    onClick={onClose}
                    className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 flex items-center justify-center transition-all hover:scale-105"
                >
                    <PhoneOff size={28} />
                </button>
            </div>
        </div>
    );
}
