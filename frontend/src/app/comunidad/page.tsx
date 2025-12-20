"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ActivityFeed from "@/components/ActivityFeed";
import { Badge } from "@/components/ui";

export default function ComunidadPage() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Feed */}
                <div className="lg:col-span-2">
                    <div className="mb-8 p-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="relative z-10">
                            <Badge variant="warning" className="mb-4">Beta</Badge>
                            <h1 className="text-4xl font-bold text-white mb-4">Comunidad INEA.mx</h1>
                            <p className="text-xl text-blue-200">
                                Descubre lo que están aprendiendo otros estudiantes en tiempo real.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        📡 Actividad Reciente
                    </h2>
                    <ActivityFeed />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800/20 rounded-2xl p-6 border border-white/5 sticky top-24">
                        <h3 className="font-bold text-white mb-4">Top Estudiantes 🏆</h3>
                        {/* Placeholder for top students */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                                        {i}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">Estudiante {i}</div>
                                        <div className="text-xs text-gray-500">1,2{50 * i} XP</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
