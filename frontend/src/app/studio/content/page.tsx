"use client";

import StudioLayout from "@/components/StudioLayout";
import { Save, Eye, MoreVertical } from "lucide-react";

export default function ContentEditorPage() {
    return (
        <StudioLayout>
            <div className="max-w-4xl mx-auto h-full flex flex-col">
                {/* Editor Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <input
                            type="text"
                            defaultValue="Nueva Lección sin título"
                            className="bg-transparent text-3xl font-bold text-white border-none focus:ring-0 placeholder-gray-600 w-full"
                        />
                        <p className="text-gray-400 text-sm mt-1">Guardado automáticamente hace 2 min</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 text-sm font-medium">
                            <Eye size={18} /> Vista Previa
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white shadow-lg text-sm font-bold">
                            <Save size={18} /> Publicar
                        </button>
                    </div>
                </div>

                {/* Editor Area (Mock) */}
                <div className="flex-1 bg-slate-800 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    {/* Toolbar */}
                    <div className="p-3 border-b border-white/5 flex gap-2 overflow-x-auto">
                        {['B', 'I', 'U', 'H1', 'H2', 'List', 'Quote', 'Code', 'Image', 'Video'].map(tool => (
                            <button key={tool} className="px-3 py-1.5 rounded hover:bg-white/5 text-sm font-medium text-gray-300">
                                {tool}
                            </button>
                        ))}
                    </div>

                    {/* Writing Area */}
                    <textarea
                        className="flex-1 bg-transparent p-6 text-gray-200 resize-none border-none focus:ring-0 leading-relaxed font-mono text-lg"
                        placeholder="Empieza a escribir tu lección aquí..."
                        defaultValue={`# Introducción

En esta lección vamos a aprender sobre...

## Objetivos
1. Comprender el concepto de...
2. Aplicar la fórmula...

![Diagrama](https://placehold.co/600x400/222/white?text=Diagram)

> "La educación es el arma más poderos..."
`}
                    />
                </div>
            </div>
        </StudioLayout>
    );
}
