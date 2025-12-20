"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton, Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function OrgDashboardPage({ params }: { params: { slug: string } }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    // Mock data for graph
    const data = [
        { name: 'Lun', progress: 40 },
        { name: 'Mar', progress: 30 },
        { name: 'Mie', progress: 60 },
        { name: 'Jue', progress: 45 },
        { name: 'Vie', progress: 80 },
        { name: 'Sab', progress: 55 },
        { name: 'Dom', progress: 70 },
    ];

    useEffect(() => {
        // Fetch real stats here via 'get_organization_stats' rpc
        // Mocking for immediate visual feedback if RPC fails or no data
        const fetchStats = async () => {
            // In real scenario:
            // const { data } = await supabase.rpc('get_organization_stats', { org_id_input: '...' });
            // setStats(data);
            setTimeout(() => {
                setStats({
                    total_members: 24,
                    license_limit: 50,
                    active_students: 18,
                    average_progress: 4.2 // classes completed
                });
                setLoading(false);
            }, 1000);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Resumen General</h1>
                    <p className="text-slate-400">Bienvenido de vuelta, Admin.</p>
                </div>
                <Button variant="primary">Invitar Usuarios</Button>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Colaboradores"
                    value={stats.total_members}
                    sub={`${stats.license_limit - stats.total_members} licencias disponibles`}
                    icon={<Users className="text-blue-400" />}
                />
                <StatCard
                    title="Estudiantes Activos"
                    value={stats.active_students}
                    sub="En los últimos 30 días"
                    icon={<TrendingUp className="text-emerald-400" />}
                />
                <StatCard
                    title="Promedio Avance"
                    value={stats.average_progress}
                    sub="Lecciones por usuario"
                    icon={<BookOpen className="text-amber-400" />}
                />
                <StatCard
                    title="En Riesgo"
                    value="2"
                    sub="Sin actividad > 15 días"
                    icon={<AlertCircle className="text-red-400" />}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Actividad de Aprendizaje</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Mejores Estudiantes</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Ana García", role: "Ventas", progress: 95 },
                            { name: "Carlos Ruiz", role: "Almacén", progress: 82 },
                            { name: "Maria Lopez", role: "Logística", progress: 78 },
                        ].map((student, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{student.name}</div>
                                        <div className="text-xs text-slate-400">{student.role}</div>
                                    </div>
                                </div>
                                <span className="text-emerald-400 font-bold text-sm">{student.progress}%</span>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-sm text-slate-400">Ver todos</Button>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, icon }: { title: string, value: string | number, sub: string, icon: any }) {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {icon}
                </div>
                {/* <Badge variant="success" className="bg-emerald-500/10 text-emerald-400">+12%</Badge> */}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-400">{title}</div>
            <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-white/5">{sub}</div>
        </Card>
    );
}
