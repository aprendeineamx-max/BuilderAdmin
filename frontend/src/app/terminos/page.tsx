import Link from "next/link";

export default function TerminosPage() {
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
                <h1 className="text-3xl font-bold text-white mb-8">Términos de Uso</h1>

                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar la plataforma INEA.mx, usted acepta cumplir con estos términos
                            de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar
                            nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Descripción del Servicio</h2>
                        <p>
                            INEA.mx es una plataforma educativa gratuita que ofrece cursos de educación básica
                            para adultos, incluyendo primaria y secundaria, con apoyo de inteligencia artificial.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Registro de Usuario</h2>
                        <p>
                            Para acceder a todos los servicios, debe crear una cuenta proporcionando información
                            veraz y actualizada. Es responsable de mantener la confidencialidad de sus credenciales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Uso Aceptable</h2>
                        <p>
                            El usuario se compromete a utilizar la plataforma únicamente con fines educativos
                            legítimos. Está prohibido:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Compartir credenciales de acceso</li>
                            <li>Copiar o redistribuir contenido sin autorización</li>
                            <li>Utilizar el servicio para fines comerciales</li>
                            <li>Intentar acceder a áreas restringidas del sistema</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido, incluyendo textos, gráficos, logos y software, es propiedad
                            del INEA o sus licenciantes y está protegido por las leyes de propiedad intelectual.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Certificaciones</h2>
                        <p>
                            Los certificados emitidos a través de la plataforma tienen validez oficial de la
                            Secretaría de Educación Pública (SEP) de México, sujeto a la verificación de los
                            requisitos educativos correspondientes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Modificaciones</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento.
                            Los cambios serán efectivos inmediatamente después de su publicación.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">8. Contacto</h2>
                        <p>
                            Para dudas sobre estos términos, contacte a soporte@inea.mx
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
