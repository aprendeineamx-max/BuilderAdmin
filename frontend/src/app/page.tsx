import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-white font-bold text-xl">INEA.mx</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#cursos" className="text-gray-300 hover:text-white transition-colors">Cursos</a>
              <a href="#beneficios" className="text-gray-300 hover:text-white transition-colors">Beneficios</a>
              <a href="#tutor" className="text-gray-300 hover:text-white transition-colors">Tutor IA</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Iniciar Sesión</Link>
              <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6">
            ✨ Plataforma de Educación para Adultos
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Aprende a tu ritmo,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              transforma tu futuro
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            El Instituto Nacional para la Educación de los Adultos te ofrece cursos gratuitos
            de primaria y secundaria con apoyo de inteligencia artificial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
              Comenzar Ahora — Es Gratis
            </Link>
            <Link href="/cursos" className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20">
              Ver Cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="beneficios" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            ¿Por qué elegir INEA.mx?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Combina la experiencia educativa del INEA con tecnología de vanguardia
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Certificación Oficial</h3>
              <p className="text-gray-400">
                Obtén tu certificado de primaria o secundaria con validez oficial de la SEP.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tutor con IA</h3>
              <p className="text-gray-400">
                Un asistente inteligente disponible 24/7 para resolver tus dudas al instante.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Acceso desde Cualquier Lugar</h3>
              <p className="text-gray-400">
                Estudia desde tu celular, tablet o computadora cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tutor Section */}
      <section id="tutor" className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium mb-6">
                🤖 Profe INEA - Tu Tutor Virtual
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Aprende con ayuda de
                <span className="text-emerald-400"> Inteligencia Artificial</span>
              </h2>
              <p className="text-gray-400 mb-6">
                Nuestro tutor virtual "Profe INEA" está disponible las 24 horas para ayudarte
                con tus dudas. Ya sea matemáticas, lectura, ciencias o cualquier tema,
                te explica de manera clara y con ejemplos de la vida diaria.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                  Respuestas instantáneas en menos de 1 segundo
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                  Explicaciones con ejemplos de la vida real
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                  Disponible cuando tú lo necesites
                </li>
              </ul>
              <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                Probar el Tutor
                <span>→</span>
              </Link>
            </div>
            {/* Chat Preview */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <div className="text-white font-medium">Profe INEA</div>
                  <div className="text-emerald-400 text-sm">En línea</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-xs">
                    ¿Cómo sumo fracciones con diferente denominador?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-gray-200 px-4 py-2 rounded-2xl rounded-bl-none max-w-xs">
                    ¡Excelente pregunta! 🎉 Para sumar fracciones con diferente denominador,
                    primero debes encontrar un denominador común. Te lo explico con un ejemplo:
                    imagina que tienes 1/2 pizza y 1/4 pizza...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-12 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu educación?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Únete a miles de mexicanos que ya están transformando su futuro con educación gratuita.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Empezar Ahora — 100% Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 INEA.mx - Instituto Nacional para la Educación de los Adultos</p>
          <p className="mt-2 text-sm">Educación para todos, en cualquier momento</p>
        </div>
      </footer>
    </div>
  );
}
