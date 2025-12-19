import Link from "next/link";

const cursos = [
    {
        id: "matematicas",
        titulo: "Matemáticas Básicas",
        descripcion: "Aprende sumas, restas, multiplicación, división y fracciones",
        progreso: 35,
        lecciones: 12,
        completadas: 4,
        icono: "📐",
        color: "blue"
    },
    {
        id: "lectura",
        titulo: "Lectura y Escritura",
        descripcion: "Mejora tu comprensión lectora y redacción",
        progreso: 60,
        lecciones: 10,
        completadas: 6,
        icono: "📚",
        color: "emerald"
    },
    {
        id: "ciencias",
        titulo: "Ciencias Naturales",
        descripcion: "Conoce la naturaleza, salud y medio ambiente",
        progreso: 20,
        lecciones: 8,
        completadas: 2,
        icono: "🌿",
        color: "purple"
    },
    {
        id: "historia",
        titulo: "Historia y Civismo",
        descripcion: "Conoce la historia de México y tus derechos",
        progreso: 0,
        lecciones: 10,
        completadas: 0,
        icono: "🏛️",
        color: "amber"
    }
];

export default function DashboardPage() {
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
                            <Link href="/chat" className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                                <span>🤖</span> Tutor IA
                            </Link>
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
                                MA
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        ¡Bienvenido de nuevo, María! 👋
                    </h1>
                    <p className="text-gray-400">
                        Continúa tu aprendizaje donde lo dejaste
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="text-3xl font-bold text-white">12</div>
                        <div className="text-gray-400 text-sm">Lecciones completadas</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="text-3xl font-bold text-emerald-400">35%</div>
                        <div className="text-gray-400 text-sm">Progreso general</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="text-3xl font-bold text-blue-400">8</div>
                        <div className="text-gray-400 text-sm">Quizzes aprobados</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="text-3xl font-bold text-amber-400">5</div>
                        <div className="text-gray-400 text-sm">Días de racha</div>
                    </div>
                </div>

                {/* Courses Grid */}
                <h2 className="text-xl font-semibold text-white mb-4">Tus Cursos</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {cursos.map((curso) => (
                        <Link
                            key={curso.id}
                            href={`/curso/${curso.id}`}
                            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center text-3xl">
                                    {curso.icono}
                                </div>
                                <span className="text-sm text-gray-400">
                                    {curso.completadas}/{curso.lecciones} lecciones
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{curso.titulo}</h3>
                            <p className="text-gray-400 text-sm mb-4">{curso.descripcion}</p>
                            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${curso.color === "blue" ? "from-blue-500 to-blue-400" :
                                            curso.color === "emerald" ? "from-emerald-500 to-emerald-400" :
                                                curso.color === "purple" ? "from-purple-500 to-purple-400" :
                                                    "from-amber-500 to-amber-400"
                                        } rounded-full transition-all`}
                                    style={{ width: `${curso.progreso}%` }}
                                />
                            </div>
                            <div className="mt-2 text-right text-sm text-gray-400">
                                {curso.progreso}% completado
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/chat" className="bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl p-4 text-center transition-colors border border-emerald-500/30">
                        <span className="text-2xl block mb-2">💬</span>
                        <span className="text-emerald-400 font-medium">Pregunta al Tutor</span>
                    </Link>
                    <Link href="/cursos" className="bg-blue-500/20 hover:bg-blue-500/30 rounded-xl p-4 text-center transition-colors border border-blue-500/30">
                        <span className="text-2xl block mb-2">📖</span>
                        <span className="text-blue-400 font-medium">Ver Cursos</span>
                    </Link>
                    <Link href="/quiz" className="bg-purple-500/20 hover:bg-purple-500/30 rounded-xl p-4 text-center transition-colors border border-purple-500/30">
                        <span className="text-2xl block mb-2">✍️</span>
                        <span className="text-purple-400 font-medium">Hacer Quiz</span>
                    </Link>
                    <Link href="/perfil" className="bg-amber-500/20 hover:bg-amber-500/30 rounded-xl p-4 text-center transition-colors border border-amber-500/30">
                        <span className="text-2xl block mb-2">👤</span>
                        <span className="text-amber-400 font-medium">Mi Perfil</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
