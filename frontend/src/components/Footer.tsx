import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-white/10 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-white font-bold text-xl">INEA.mx</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Plataforma de educación para adultos del Instituto Nacional para la Educación de los Adultos.
                        </p>
                    </div>

                    {/* Cursos */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Cursos</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/cursos?cat=matematicas" className="hover:text-white">Matemáticas</Link></li>
                            <li><Link href="/cursos?cat=lectura" className="hover:text-white">Lectura y Escritura</Link></li>
                            <li><Link href="/cursos?cat=ciencias" className="hover:text-white">Ciencias Naturales</Link></li>
                            <li><Link href="/cursos?cat=sociedad" className="hover:text-white">Ciencias Sociales</Link></li>
                        </ul>
                    </div>

                    {/* Plataforma */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Plataforma</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/chat" className="hover:text-white">Tutor IA</Link></li>
                            <li><Link href="/quiz" className="hover:text-white">Quizzes</Link></li>
                            <li><Link href="/ayuda" className="hover:text-white">Centro de Ayuda</Link></li>
                            <li><Link href="/perfil" className="hover:text-white">Mi Perfil</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/terminos" className="hover:text-white">Términos de Uso</Link></li>
                            <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                            <li><Link href="/accesibilidad" className="hover:text-white">Accesibilidad</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2025 INEA.mx - Instituto Nacional para la Educación de los Adultos
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            📘 Facebook
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            🐦 Twitter
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            📺 YouTube
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
