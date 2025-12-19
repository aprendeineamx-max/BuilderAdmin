import Link from "next/link";

const faqs = [
    {
        pregunta: "¿Qué es INEA.mx?",
        respuesta: "INEA.mx es una plataforma de educación en línea del Instituto Nacional para la Educación de los Adultos (INEA). Ofrecemos cursos gratuitos de primaria y secundaria con apoyo de inteligencia artificial."
    },
    {
        pregunta: "¿Los cursos son gratuitos?",
        respuesta: "Sí, todos los cursos son 100% gratuitos. El INEA es una institución pública que ofrece educación para adultos sin costo alguno."
    },
    {
        pregunta: "¿Cómo funciona el Tutor IA?",
        respuesta: "Nuestro tutor virtual 'Profe INEA' está disponible 24/7 para resolver tus dudas. Simplemente escribe tu pregunta en el chat y recibirás una respuesta instantánea con explicaciones claras y ejemplos."
    },
    {
        pregunta: "¿Los certificados tienen validez oficial?",
        respuesta: "Sí, al completar tus estudios con el INEA, recibirás un certificado con validez oficial de la Secretaría de Educación Pública (SEP)."
    },
    {
        pregunta: "¿Puedo estudiar desde mi celular?",
        respuesta: "Sí, la plataforma está optimizada para dispositivos móviles. Puedes estudiar desde tu celular, tablet o computadora en cualquier momento."
    },
    {
        pregunta: "¿Cuánto tiempo tengo para completar un curso?",
        respuesta: "No hay límite de tiempo. Puedes avanzar a tu propio ritmo. Nuestro sistema guarda tu progreso automáticamente."
    },
    {
        pregunta: "¿Necesito internet para estudiar?",
        respuesta: "Para acceder a los cursos necesitas conexión a internet. Sin embargo, estamos trabajando en un modo offline que te permitirá descargar lecciones."
    },
    {
        pregunta: "¿Cómo contacto al soporte?",
        respuesta: "Puedes usar el chat del Tutor IA para resolver la mayoría de dudas. Para asuntos administrativos, envía un correo a soporte@inea.mx."
    }
];

export default function AyudaPage() {
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
                        <Link href="/dashboard" className="text-gray-300 hover:text-white">
                            ← Volver al Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-5xl mb-4 block">❓</span>
                    <h1 className="text-3xl font-bold text-white mb-2">Centro de Ayuda</h1>
                    <p className="text-gray-400">Encuentra respuestas a las preguntas más frecuentes</p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-12">
                    <Link href="/chat" className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6 text-center hover:bg-emerald-500/30 transition-colors">
                        <span className="text-3xl block mb-2">🤖</span>
                        <h3 className="text-white font-semibold">Chat con Tutor IA</h3>
                        <p className="text-gray-400 text-sm mt-1">Respuestas instantáneas</p>
                    </Link>
                    <a href="mailto:soporte@inea.mx" className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 text-center hover:bg-blue-500/30 transition-colors">
                        <span className="text-3xl block mb-2">📧</span>
                        <h3 className="text-white font-semibold">Enviar Correo</h3>
                        <p className="text-gray-400 text-sm mt-1">soporte@inea.mx</p>
                    </a>
                    <a href="tel:8001112345" className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6 text-center hover:bg-purple-500/30 transition-colors">
                        <span className="text-3xl block mb-2">📞</span>
                        <h3 className="text-white font-semibold">Llamar</h3>
                        <p className="text-gray-400 text-sm mt-1">800-111-2345</p>
                    </a>
                </div>

                {/* FAQs */}
                <h2 className="text-xl font-semibold text-white mb-6">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="bg-white/5 rounded-xl border border-white/10 overflow-hidden group"
                        >
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between text-white font-medium hover:bg-white/5">
                                <span>{faq.pregunta}</span>
                                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="px-6 py-4 bg-slate-800/50 text-gray-300 border-t border-white/10">
                                {faq.respuesta}
                            </div>
                        </details>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="mt-12 bg-white/5 rounded-2xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">¿No encontraste tu respuesta?</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Tu pregunta</label>
                            <textarea
                                placeholder="Describe tu duda o problema..."
                                rows={4}
                                className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Tu correo</label>
                                <input
                                    type="email"
                                    placeholder="tu@correo.com"
                                    className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Tema</label>
                                <select className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10">
                                    <option>Problema técnico</option>
                                    <option>Duda sobre cursos</option>
                                    <option>Certificados</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                        >
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
