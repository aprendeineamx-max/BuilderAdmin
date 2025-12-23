"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Lock, PlayCircle, Star, Trophy } from "lucide-react";

interface PathNode {
    id: string;
    title: string;
    description: string;
    step_order: number;
    node_type: "course" | "quiz" | "milestone";
    is_completed: boolean;
    is_locked: boolean;
    curso_id?: number;
}

interface PathMapProps {
    pathTitle: string;
    nodes: PathNode[];
    currentStepIndex: number; // 0-based
}

export default function LearningPathMap({ pathTitle, nodes, currentStepIndex }: PathMapProps) {
    return (
        <div className="w-full max-w-3xl mx-auto py-12 px-4 relative">

            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-block p-4 rounded-full bg-emerald-500/20 mb-4 ring-4 ring-emerald-500/10">
                    <Trophy size={48} className="text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{pathTitle}</h2>
                <p className="text-gray-400">Tu camino hacia el éxito</p>
                <div className="mt-4 bg-slate-800 rounded-full h-2 w-48 mx-auto overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: `${(Math.max(0, currentStepIndex) / nodes.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* The Path */}
            <div className="relative">
                {/* SVG Connecting Line (Snake shape) */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-slate-800 -z-10 hidden md:block" />

                {nodes.map((node, index) => {
                    const isLeft = index % 2 === 0;
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const isLocked = index > currentStepIndex;

                    return (
                        <div key={node.id} className={`group flex items-center mb-16 relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}>

                            {/* Card Content */}
                            <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} px-4`}>
                                <div className={`inline-block transition-all duration-300 transform group-hover:scale-105 ${isActive ? 'scale-105' : ''
                                    }`}>
                                    <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-colors ${isActive
                                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]'
                                            : isCompleted
                                                ? 'bg-emerald-900/10 border-emerald-500/30'
                                                : 'bg-slate-800/50 border-white/5 opacity-60'
                                        }`}>
                                        <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-gray-400'
                                            }`}>
                                            {node.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 max-w-xs">{node.description}</p>

                                        {!isLocked && (
                                            <Link
                                                href={node.curso_id ? `/clase/${node.curso_id}` : '#'}
                                                className={`mt-4 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive
                                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                                                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                                                    }`}
                                            >
                                                {isCompleted ? 'Repasar' : 'Comenzar'}
                                                <PlayCircle size={16} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Center Node Indicator */}
                            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 transition-all ${isCompleted
                                        ? 'bg-emerald-500 border-emerald-900 text-white shadow-lg shadow-emerald-500/30'
                                        : isActive
                                            ? 'bg-blue-600 border-blue-900 text-white animate-pulse shadow-lg shadow-blue-500/50'
                                            : 'bg-slate-900 border-slate-700 text-slate-600'
                                    }`}>
                                    {isCompleted ? <CheckCircle size={24} /> :
                                        isActive ? <Star size={24} fill="currentColor" /> :
                                            <Lock size={20} />
                                    }
                                </div>
                            </div>

                            <div className="flex-1 hidden md:block" />
                        </div>
                    );
                })}

                {/* Final Trophy */}
                <div className="flex justify-center mt-8">
                    <div className="w-20 h-20 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center opacity-50 grayscale group-hover:grayscale-0 transition-all">
                        <Trophy size={40} className="text-yellow-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
