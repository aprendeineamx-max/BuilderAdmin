"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge } from "@/components/ui";
import Link from "next/link";
import { CheckCircle2, BarChart3, Users, Award } from "lucide-react";

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-900"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <Badge variant="info" className="mb-6 px-4 py-1.5 text-sm uppercase tracking-widest border border-blue-500/30 bg-blue-500/10">Para Empresas</Badge>
                    <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Transforma el Potencial <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">de tu Fuerza Laboral</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Ofrece a tus colaboradores la oportunidad de terminar su primaria y secundaria.
                        Aumenta la productividad, reduce la rotación y mejora la vida de tu equipo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact-sales">
                            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-slate-900 hover:bg-slate-100 font-bold">
                                Hablar con Ventas
                            </Button>
                        </Link>
                        <Link href="/demo-enterprise">
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-slate-800/50 border-slate-700 hover:bg-slate-800">
                                Ver Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-slate-800/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard
                        icon={<BarChart3 className="w-10 h-10 text-emerald-400" />}
                        title="Reportes en Tiempo Real"
                        description="Monitorea el avance de cada empleado. Identifica áreas de mejora y celebra los logros al instante."
                    />
                    <FeatureCard
                        icon={<Users className="w-10 h-10 text-blue-400" />}
                        title="Gestión Centralizada"
                        description="Administra licencias, inscribe usuarios y asigna cursos desde un panel de control intuitivo."
                    />
                    <FeatureCard
                        icon={<Award className="w-10 h-10 text-amber-400" />}
                        title="Certificación Oficial"
                        description="Tus empleados obtienen certificados válidos ante la SEP al completar sus estudios."
                    />
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Un Panel de Control <br /> diseñado para RH
                            </h2>
                            <ul className="space-y-6">
                                <ListItem text="Visualiza el ROI de capacitación" />
                                <ListItem text="Descarga reportes en Excel/PDF" />
                                <ListItem text="Asigna tutores IA personalizados" />
                                <ListItem text="Integración con tu LMS existente (SCORM)" />
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                                {/* Mock Dashboard UI */}
                                <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-lg">
                                        [Dashboard Preview Image]
                                    </div>
                                    {/* Abstract UI representation */}
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                        <div className="w-32 h-4 bg-slate-800 rounded"></div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 grid grid-cols-4 gap-4">
                                        <div className="col-span-1 h-32 bg-slate-800 rounded-lg"></div>
                                        <div className="col-span-3 h-32 bg-slate-800/50 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-gradient-to-r from-blue-900 to-indigo-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        ¿Listo para impulsar a tu equipo?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Únete a empresas como Tech Corp y Grupo Modelo que ya están capacitando con INEA.mx
                    </p>
                    <Link href="/register-enterprise">
                        <Button className="px-10 py-5 text-xl bg-white text-blue-900 hover:bg-blue-50">
                            Crear Cuenta Empresarial
                        </Button>
                    </Link>
                    <p className="mt-4 text-sm text-blue-200">
                        Prueba gratuita de 14 días. No requiere tarjeta.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition">
            <div className="mb-6 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}

function ListItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-4 text-slate-300">
            <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
            <span className="text-lg">{text}</span>
        </li>
    );
}
