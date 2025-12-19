import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-8xl mb-6">📚</div>
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                    Página no encontrada
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    La página que buscas no existe o fue movida.
                    ¿Quizás quieres explorar nuestros cursos?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90"
                    >
                        Ir al Inicio
                    </Link>
                    <Link
                        href="/cursos"
                        className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 border border-white/20"
                    >
                        Ver Cursos
                    </Link>
                </div>

                {/* Help */}
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🤖</span>
                        <span className="text-white font-medium">¿Necesitas ayuda?</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Nuestro tutor IA puede ayudarte a encontrar lo que buscas.
                    </p>
                    <Link
                        href="/chat"
                        className="block w-full py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-center hover:bg-emerald-500/30"
                    >
                        Preguntar al Tutor
                    </Link>
                </div>
            </div>
        </div>
    );
}
