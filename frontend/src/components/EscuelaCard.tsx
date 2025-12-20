import Link from 'next/link';

interface EscuelaCardProps {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    color?: string;
    courseCount?: number;
}

export default function EscuelaCard({ name, slug, description, icon, color = "#3b82f6", courseCount = 0 }: EscuelaCardProps) {
    return (
        <Link href={`/escuela/${slug}`} className="group block h-full">
            <div className="relative h-full bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
                {/* Decorative Gradient Background */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${color}10, transparent)` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-2"
                            style={{ backgroundColor: `${color}20`, color: color }}
                        >
                            {icon || "📚"}
                        </div>
                        {courseCount > 0 && (
                            <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-white/5">
                                {courseCount} Rutas
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                        {description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center text-xs font-medium text-slate-500 group-hover:text-white transition-colors gap-1">
                        <span>Explorar Escuela</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
