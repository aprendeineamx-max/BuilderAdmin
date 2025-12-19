"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
    id: number;
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
}

const quizData: Question[] = [
    {
        id: 1,
        pregunta: "¿Cuánto es 1/2 + 1/4?",
        opciones: ["1/6", "3/4", "2/4", "1/8"],
        respuestaCorrecta: 1
    },
    {
        id: 2,
        pregunta: "Si tienes 3/4 de pizza y comes 1/4, ¿cuánto te queda?",
        opciones: ["1/4", "2/4", "3/4", "4/4"],
        respuestaCorrecta: 1
    },
    {
        id: 3,
        pregunta: "¿Cuál fracción es equivalente a 2/4?",
        opciones: ["1/4", "1/2", "3/4", "2/8"],
        respuestaCorrecta: 1
    }
];

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelectAnswer = (optionIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate score
            let correctCount = 0;
            quizData.forEach((q, i) => {
                if (selectedAnswers[i] === q.respuestaCorrecta) {
                    correctCount++;
                }
            });
            setScore(correctCount);
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setScore(0);
    };

    const progress = ((currentQuestion + 1) / quizData.length) * 100;

    if (showResults) {
        const percentage = Math.round((score / quizData.length) * 100);
        const passed = percentage >= 70;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
                    <div className={`text-6xl mb-4 ${passed ? "animate-bounce" : ""}`}>
                        {passed ? "🎉" : "📚"}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {passed ? "¡Felicidades!" : "¡Sigue Practicando!"}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {passed
                            ? "Has aprobado el quiz exitosamente"
                            : "Necesitas 70% para aprobar. ¡Inténtalo de nuevo!"}
                    </p>

                    <div className="bg-slate-800 rounded-xl p-6 mb-6">
                        <div className="text-5xl font-bold text-white mb-2">
                            {score}/{quizData.length}
                        </div>
                        <div className="text-gray-400">Respuestas correctas</div>
                        <div className={`text-2xl font-bold mt-2 ${passed ? "text-emerald-400" : "text-amber-400"}`}>
                            {percentage}%
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleRestart}
                            className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20"
                        >
                            Intentar de Nuevo
                        </button>
                        <Link
                            href="/cursos"
                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90 text-center"
                        >
                            Ver Más Cursos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const question = quizData[currentQuestion];

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
                        <Link href="/cursos" className="text-gray-300 hover:text-white">
                            ← Volver a Cursos
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Pregunta {currentQuestion + 1} de {quizData.length}</span>
                        <span>{Math.round(progress)}% completado</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm mb-4">
                        📝 Quiz: Fracciones Básicas
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {question.pregunta}
                    </h2>

                    <div className="space-y-3">
                        {question.opciones.map((opcion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(index)}
                                className={`w-full p-4 rounded-xl text-left transition-all ${selectedAnswers[currentQuestion] === index
                                        ? "bg-blue-500/30 border-2 border-blue-500 text-white"
                                        : "bg-slate-700/50 border-2 border-transparent text-gray-300 hover:bg-slate-700"
                                    }`}
                            >
                                <span className="inline-block w-8 h-8 rounded-full bg-slate-600 text-center leading-8 mr-3">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {opcion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestion === quizData.length - 1 ? "Ver Resultados" : "Siguiente →"}
                    </button>
                </div>

                {/* Help */}
                <Link
                    href="/chat"
                    className="mt-6 flex items-center justify-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                    <span>🤖</span> ¿Necesitas ayuda? Pregúntale al Tutor IA
                </Link>
            </main>
        </div>
    );
}
