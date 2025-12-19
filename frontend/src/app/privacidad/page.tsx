import Link from "next/link";

export default function PrivacidadPage() {
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
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidad</h1>

                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Información que Recopilamos</h2>
                        <p>Recopilamos la siguiente información cuando utiliza nuestra plataforma:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Nombre y correo electrónico</li>
                            <li>Progreso educativo y calificaciones</li>
                            <li>Interacciones con el tutor IA</li>
                            <li>Información de uso del sitio</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Uso de la Información</h2>
                        <p>Utilizamos su información para:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Proporcionar y mejorar nuestros servicios educativos</li>
                            <li>Personalizar su experiencia de aprendizaje</li>
                            <li>Emitir certificados oficiales</li>
                            <li>Comunicarnos sobre actualizaciones y mejoras</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Protección de Datos</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger
                            su información personal contra acceso no autorizado, pérdida o alteración.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Compartir Información</h2>
                        <p>
                            No vendemos ni compartimos su información personal con terceros, excepto
                            cuando sea necesario para proporcionar nuestros servicios o cumplir con
                            obligaciones legales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Sus Derechos</h2>
                        <p>Usted tiene derecho a:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Acceder a su información personal</li>
                            <li>Corregir datos inexactos</li>
                            <li>Solicitar la eliminación de sus datos</li>
                            <li>Exportar su información</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
                        <p>
                            Utilizamos cookies para mejorar su experiencia de navegación y analizar
                            el uso del sitio. Puede configurar su navegador para rechazar cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Contacto</h2>
                        <p>
                            Para ejercer sus derechos o resolver dudas sobre privacidad,
                            contacte a: privacidad@inea.mx
                        </p>
                    </section>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm">Última actualización: Diciembre 2024</p>
                </div>
            </main>
        </div>
    );
}
