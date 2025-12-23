"use client";

import { useState, useEffect } from "react";
import { Timer, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Flag } from "lucide-react";

interface Question {
    id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'boolean' | 'pairing';
    points: number;
    options: Option[];
}

interface Option {
    id: string;
    label: string;
    value?: string; // For pairing
}

interface ExamRunnerProps {
    examTitle: string;
    timeLimitMinutes: number;
    questions: Question[];
    onComplete: (score: number, answers: any) => void;
}

export default function ExamRunner({ examTitle, timeLimitMinutes, questions, onComplete }: ExamRunnerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
    const [isFinished, setIsFinished] = useState(false);

    // Timer Effect
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswer = (val: any) => {
        setAnswers({ ...answers, [questions[currentIndex].id]: val });
    };

    const handleSubmit = () => {
        if (isFinished) return;
        setIsFinished(true);
        // Simple mock grading
        // Ideally we compare with server-side "correct" values
        // For demo UI we just pass answers to parent
        onComplete(0, answers);
    };

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-slate-900 border-b border-white/10 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">{examTitle}</h2>
                    <p className="text-sm text-gray-400">Pregunta {currentIndex + 1} de {questions.length}</p>
                </div>
                <div className={`text-2xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                    <Timer size={24} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-700">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            {/* Question Area */}
            <div className="p-8 md:p-12 min-h-[400px] flex flex-col">
                <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-4 border border-blue-500/20 uppercase tracking-wider">
                        {currentQ.question_type.replace('_', ' ')} • {currentQ.points} puntos
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-8">{currentQ.question_text}</h3>

                    {/* Options Render */}
                    <div className="space-y-4 max-w-2xl">
                        {currentQ.question_type === 'multiple_choice' && currentQ.options.map(opt => (
                            <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${answers[currentQ.id] === opt.id
                                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                                    : 'bg-slate-700/30 border-white/5 hover:border-white/20 hover:bg-slate-700/50'
                                }`}>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQ.id] === opt.id ? 'border-blue-400' : 'border-gray-500'
                                    }`}>
                                    {answers[currentQ.id] === opt.id && <div className="w-3 h-3 rounded-full bg-blue-400" />}
                                </div>
                                <input
                                    type="radio"
                                    name={`q-${currentQ.id}`}
                                    className="hidden"
                                    checked={answers[currentQ.id] === opt.id}
                                    onChange={() => handleAnswer(opt.id)}
                                />
                                <span className="text-lg text-gray-200">{opt.label}</span>
                            </label>
                        ))}

                        {currentQ.question_type === 'boolean' && currentQ.options.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => handleAnswer(opt.id)}
                                className={`w-full p-6 rounded-xl border text-center font-bold text-xl transition-all ${answers[currentQ.id] === opt.id
                                        ? 'bg-blue-600 border-blue-400 text-white'
                                        : 'bg-slate-700/30 border-white/5 text-gray-400 hover:bg-slate-700'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}

                        {currentQ.question_type === 'pairing' && (
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm mb-2 text-center uppercase">Concepto</p>
                                    {currentQ.options.map(opt => (
                                        <div key={opt.id} className="p-4 bg-slate-700 rounded-lg text-center border border-white/5">{opt.label}</div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm mb-2 text-center uppercase">Definición (Selecciona)</p>
                                    {currentQ.options.map(opt => (
                                        <select
                                            key={`match-${opt.id}`}
                                            className="w-full p-4 bg-slate-800 rounded-lg text-white border border-white/10 focus:ring-blue-500 cursor-pointer"
                                            onChange={(e) => {
                                                const currentMatches = answers[currentQ.id] || {};
                                                handleAnswer({ ...currentMatches, [opt.id]: e.target.value });
                                            }}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {currentQ.options.map(target => (
                                                <option key={target.value} value={target.value}>{target.value}</option>
                                            ))}
                                        </select>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft /> Anterior
                    </button>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/10 transition-colors">
                            <Flag size={16} /> Marcar para revisión
                        </button>
                    </div>

                    {currentIndex < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
                        >
                            Siguiente <ChevronRight />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/20 transition-transform active:scale-95 animate-pulse"
                        >
                            Finalizar Examen <CheckCircle />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
