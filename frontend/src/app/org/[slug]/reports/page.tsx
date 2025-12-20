"use client";

import { Button, Card } from "@/components/ui";
import { FileText, Download, Calendar } from "lucide-react";

export default function OrgReportsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reportes y Resultados</h1>
                    <p className="text-slate-400">Descarga métricas detalladas del desempeño de tu organización.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reporte General */}
                <ReportCard
                    title="Reporte de Progreso General"
                    description="Resumen ejecutivo del avance de todos los colaboradores, horas estudiadas y cursos completados."
                    lastGenerated="Hoy a las 09:00 AM"
                    type="CSV"
                />

                {/* Reporte de Certificaciones */}
                <ReportCard
                    title="Certificaciones Obtenidas"
                    description="Listado de colaboradores que han completado Rutas de Aprendizaje y obtenido insignias."
                    lastGenerated="18 Dic 2025"
                    type="PDF"
                />

                {/* Reporte de Uso de Licencias */}
                <ReportCard
                    title="Auditoría de Acceso"
                    description="Log detallado de inicios de sesión y actividad diaria por usuario."
                    lastGenerated="Hace 1 semana"
                    type="XLSX"
                />
            </div>

            <Card className="p-6 mt-8 bg-blue-600/10 border-blue-600/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-lg text-white">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Programar Reporte Mensual</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Mandar automáticamente un resumen de actividad al correo <strong>admin@techcorp.mx</strong> el día 1 de cada mes.
                        </p>
                        <Button variant="secondary" className="bg-blue-600 hover:bg-blue-500 text-white border-none">
                            Activar Programación
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function ReportCard({ title, description, lastGenerated, type }: { title: string, description: string, lastGenerated: string, type: string }) {
    return (
        <Card className="p-6 flex flex-col h-full hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-blue-400">
                    <FileText size={24} />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded uppercase text-slate-400">{type}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 flex-1">
                {description}
            </p>

            <div className="mt-auto space-y-4">
                <div className="text-xs text-slate-500">Última generación: {lastGenerated}</div>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5">
                    <Download size={16} />
                    <span>Descargar</span>
                </Button>
            </div>
        </Card>
    );
}
