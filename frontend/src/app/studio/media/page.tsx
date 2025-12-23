"use client";

import StudioLayout from "@/components/StudioLayout";
import { UploadCloud, File, Film, Image as ImageIcon, Trash2 } from "lucide-react";

export default function MediaLibraryPage() {
    return (
        <StudioLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Biblioteca Multimedia</h1>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500">
                        <UploadCloud size={20} /> Subir Archivos
                    </button>
                </div>

                {/* Drag Drop Area */}
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                    <UploadCloud size={48} className="mb-4 text-slate-600" />
                    <p className="text-lg font-medium">Arrastra y suelta tus archivos aquí</p>
                    <p className="text-sm mt-2">Soporta JPG, PNG, MP4, PDF (Max 50MB)</p>
                </div>

                {/* Filter Tabs */}
                {/* File Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                        { name: 'diagrama_1.png', type: 'image', size: '2.4 MB' },
                        { name: 'intro_video.mp4', type: 'video', size: '45 MB' },
                        { name: 'guia_estudio.pdf', type: 'doc', size: '1.1 MB' },
                        { name: 'header_bg.jpg', type: 'image', size: '3.2 MB' },
                    ].map((file, i) => (
                        <div key={i} className="group relative bg-slate-800 rounded-xl p-4 border border-white/5 hover:border-blue-500 transition-colors">
                            <div className="aspect-square bg-slate-900 rounded-lg mb-3 flex items-center justify-center">
                                {file.type === 'image' && <ImageIcon className="text-blue-500" size={32} />}
                                {file.type === 'video' && <Film className="text-pink-500" size={32} />}
                                {file.type === 'doc' && <File className="text-orange-500" size={32} />}
                            </div>
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>

                            <button className="absolute top-2 right-2 p-1.5 rounded bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </StudioLayout>
    );
}
